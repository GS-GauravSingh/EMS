import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import * as employeeService from "../services/employeeService.js";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

export default function Employees() {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Remove this employee?")) return;
    setDeletingId(id);
    try {
      await employeeService.deleteEmployee(id);
      toast.success("Employee removed");
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employees</h1>
          <p className="text-slate-600">Directory of all team members</p>
        </div>
        {isAdmin && (
          <Link to="/employees/new">
            <Button>Add employee</Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 font-medium text-slate-700">Department</th>
                <th className="px-4 py-3 font-medium text-slate-700">Role</th>
                <th className="px-4 py-3 font-medium text-slate-700">Salary</th>
                <th className="px-4 py-3 font-medium text-slate-700">Hired</th>
                {isAdmin && (
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    No employees yet.
                    {isAdmin && (
                      <>
                        {" "}
                        <Link to="/employees/new" className="text-brand-600 hover:underline">
                          Add the first one
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                employees.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.firstName} {row.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.email}</td>
                    <td className="px-4 py-3 text-slate-600">{row.department}</td>
                    <td className="px-4 py-3 text-slate-600">{row.position}</td>
                    <td className="px-4 py-3 text-slate-600">{formatMoney(row.salary)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(row.hireDate)}</td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/employees/${row._id}/edit`}>
                            <Button variant="secondary" type="button" className="!py-1.5 !px-3">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            type="button"
                            className="!py-1.5 !px-3"
                            disabled={deletingId === row._id}
                            onClick={() => handleDelete(row._id)}
                          >
                            {deletingId === row._id ? "…" : "Delete"}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
