import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-brand-600 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
            EMS
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/employees" className={linkClass}>
              Employees
            </NavLink>
            {isAdmin && (
              <NavLink to="/employees/new" className={linkClass}>
                Add Employee
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user?.name}
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {user?.role}
              </span>
            </span>
            <Button variant="secondary" type="button" onClick={() => logout()}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
