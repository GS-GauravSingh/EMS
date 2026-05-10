import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

export default function Login() {
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        toast.success("Welcome back");
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        toast.success("Account created");
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-center text-2xl font-semibold text-slate-900">
          Employee Management
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </p>

        <div className="mt-6 flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600"
            }`}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required={mode === "register"}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          First registration becomes <strong>admin</strong>. Later sign-ups are{" "}
          <strong>employees</strong>. Or use seeded admin:{" "}
          <code className="rounded bg-slate-100 px-1">npm run seed</code> in backend.
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/dashboard" className="text-brand-600 hover:underline">
            Back to app
          </Link>
        </p>
      </div>
    </div>
  );
}
