import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as employeeService from "../services/employeeService.js";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

function toInputDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    hireDate: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const emp = await employeeService.getEmployee(id);
        if (cancelled) return;
        setForm({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone || "",
          department: emp.department,
          position: emp.position,
          salary: String(emp.salary),
          hireDate: toInputDate(emp.hireDate),
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
        navigate("/employees");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await employeeService.updateEmployee(id, {
        ...form,
        salary: Number(form.salary),
        hireDate: form.hireDate,
      });
      toast.success("Employee updated");
      navigate("/employees");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/employees" className="text-sm text-brand-600 hover:underline">
          ← Back to employees
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Edit employee</h1>
        <p className="text-slate-600">Update this team member&apos;s information.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">First name</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last name</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Phone</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Department</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Position</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
            <input
              type="number"
              min="0"
              step="1"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.salary}
              onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hire date</label>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.hireDate}
              onChange={(e) => setForm((f) => ({ ...f, hireDate: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </Button>
          <Link to="/employees">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
