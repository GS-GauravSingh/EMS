import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";
import * as employeeService from "../services/employeeService.js";
import * as attendanceService from "../services/attendanceService.js";
import { useAuth } from "../context/AuthContext.jsx";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Attendance() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [statusMap, setStatusMap] = useState({});

  const [selfStatus, setSelfStatus] = useState("present");

  const [historyEmployeeId, setHistoryEmployeeId] = useState("");
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyEmployeeName, setHistoryEmployeeName] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const employeeData = await employeeService.getEmployees();
          setEmployees(employeeData);
          if (employeeData.length > 0) {
            setHistoryEmployeeId(employeeData[0]._id);
          }
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || employees.length === 0) return;
    (async () => {
      try {
        const dailyRecords = await attendanceService.getDailyAttendance(selectedDate);
        const nextMap = {};
        for (const employee of employees) {
          nextMap[employee._id] = "absent";
        }
        for (const record of dailyRecords) {
          if (record.employee?._id) {
            nextMap[record.employee._id] = record.status;
          }
        }
        setStatusMap(nextMap);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    })();
  }, [selectedDate, employees, isAdmin]);

  const dailySummary = useMemo(() => {
    let present = 0;
    let absent = 0;
    for (const employee of employees) {
      if (statusMap[employee._id] === "present") present += 1;
      else absent += 1;
    }
    return { present, absent, total: employees.length };
  }, [statusMap, employees]);

  async function saveAttendance() {
    setSaving(true);
    try {
      const records = employees.map((employee) => ({
        employeeId: employee._id,
        status: statusMap[employee._id] || "absent",
      }));
      await attendanceService.saveDailyAttendance(selectedDate, records);
      toast.success("Attendance saved");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function saveSelfAttendance() {
    setSaving(true);
    try {
      await attendanceService.markSelfAttendance({ date: selectedDate, status: selfStatus });
      toast.success("Your attendance has been marked");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function loadHistory(e) {
    e.preventDefault();
    setLoadingHistory(true);
    try {
      if (isAdmin) {
        if (!historyEmployeeId) {
          toast.error("Please select an employee");
          setLoadingHistory(false);
          return;
        }
        const res = await attendanceService.getAttendanceHistory({
          employeeId: historyEmployeeId,
          from: historyFrom || undefined,
          to: historyTo || undefined,
        });
        setHistoryRecords(res.data);
        setHistoryEmployeeName(`${res.employee.firstName} ${res.employee.lastName}`);
      } else {
        const res = await attendanceService.getSelfAttendanceHistory({
          from: historyFrom || undefined,
          to: historyTo || undefined,
        });
        setHistoryRecords(res.data);
        setHistoryEmployeeName(`${res.employee.firstName} ${res.employee.lastName}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingHistory(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance Management</h1>
          <p className="text-slate-600">
            {isAdmin
              ? "Track daily attendance and employee attendance history"
              : "Mark your attendance and view your attendance history"}
          </p>
        </div>
      </div>

      <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label className="block text-sm font-medium text-slate-700">Attendance date</label>
            <input
              type="date"
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          {isAdmin && (
            <div className="text-sm text-slate-600">
              <span className="mr-4">Total: {dailySummary.total}</span>
              <span className="mr-4 text-emerald-700">Present: {dailySummary.present}</span>
              <span className="text-rose-700">Absent: {dailySummary.absent}</span>
            </div>
          )}
        </div>

        {isAdmin ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-700">Employee</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Department</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{employee.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{employee.department}</td>
                      <td className="px-4 py-3">
                        <select
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
                          value={statusMap[employee._id] || "absent"}
                          onChange={(e) =>
                            setStatusMap((prev) => ({
                              ...prev,
                              [employee._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="button" onClick={saveAttendance} disabled={saving || employees.length === 0}>
              {saving ? "Saving..." : `Save Attendance for ${selectedDate}`}
            </Button>
          </>
        ) : (
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Your status</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
                value={selfStatus}
                onChange={(e) => setSelfStatus(e.target.value)}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <Button type="button" onClick={saveSelfAttendance} disabled={saving}>
              {saving ? "Saving..." : `Mark attendance for ${selectedDate}`}
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Attendance History</h2>
        <form className="grid gap-4 sm:grid-cols-4" onSubmit={loadHistory}>
          {isAdmin && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Employee</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
                value={historyEmployeeId}
                onChange={(e) => setHistoryEmployeeId(e.target.value)}
                required
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">From</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={historyFrom}
              onChange={(e) => setHistoryFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">To</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={historyTo}
              onChange={(e) => setHistoryTo(e.target.value)}
            />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" disabled={loadingHistory}>
              {loadingHistory ? "Loading..." : "Load history"}
            </Button>
          </div>
        </form>

        {historyEmployeeName && (
          <p className="text-sm text-slate-600">
            Showing history for <span className="font-medium">{historyEmployeeName}</span>
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Date</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 font-medium text-slate-700">Marked by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyRecords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                historyRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="px-4 py-3 text-slate-700">{formatDate(record.date)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          record.status === "present"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{record.markedBy?.name || "Unknown"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
