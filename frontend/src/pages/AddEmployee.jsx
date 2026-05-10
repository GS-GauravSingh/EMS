import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as employeeService from "../services/employeeService.js";
import Button from "../components/Button.jsx";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

const empty = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  salary: "",
  hireDate: "",
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await employeeService.createEmployee({
        ...form,
        salary: Number(form.salary),
        hireDate: form.hireDate,
      });
      toast.success("Employee created");
      navigate("/employees");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/employees" className="text-sm text-brand-600 hover:underline">
          ← Back to employees
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Add employee</h1>
        <p className="text-slate-600">Enter details for a new team member.</p>
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
            {submitting ? "Saving…" : "Save employee"}
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
