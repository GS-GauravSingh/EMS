import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import * as employeeService from "../services/employeeService.js";
import Spinner from "../components/Spinner.jsx";
import Button from "../components/Button.jsx";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await employeeService.getEmployees();
        if (!cancelled) setCount(list.length);
      } catch {
        if (!cancelled) setCount(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Hello, {user?.name}
        </h1>
        <p className="mt-1 text-slate-600">
          You are signed in as <span className="font-medium">{user?.role}</span>.
          {isAdmin
            ? " You can manage employee records."
            : " You can view the employee directory."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Employees</p>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <Spinner />
            ) : (
              <p className="text-3xl font-semibold text-slate-900">{count}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500">Total records in the system</p>
          <Link to="/employees" className="mt-4 inline-block">
            <Button variant="secondary">View directory</Button>
          </Link>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Quick actions</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Browse and search employees in the directory.</li>
            {isAdmin && <li>Add, edit, or remove employee records.</li>}
          </ul>
          {isAdmin && (
            <Link to="/employees/new" className="mt-4 inline-block">
              <Button>Add employee</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
