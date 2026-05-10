import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import * as authService from "../services/authService.js";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

const initialForm = {
  name: "",
  email: "",
  password: "",
  otp: "",
  newPassword: "",
};

export default function Login() {
  const { completeLoginOtp, completeRegisterOtp, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("credentials");
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate, loading]);

  useEffect(() => {
    setStep("credentials");
    setForm(initialForm);
  }, [mode]);

  const modeTitle = useMemo(() => {
    if (mode === "register") return "Create your account";
    if (mode === "forgot") return "Reset your password";
    return "Sign in to continue";
  }, [mode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  async function requestOtp(e) {
    e.preventDefault();
    setSendingOtp(true);

    try {
      if (mode === "login") {
        await authService.requestLoginOtp({
          email: form.email,
          password: form.password,
        });
      } else if (mode === "register") {
        await authService.requestRegisterOtp({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        await authService.requestForgotPasswordOtp({
          email: form.email,
        });
      }

      setStep("otp");
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSendingOtp(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        await completeLoginOtp({ email: form.email, otp: form.otp });
        toast.success("Login successful");
        navigate(from, { replace: true });
      } else if (mode === "register") {
        await completeRegisterOtp({ email: form.email, otp: form.otp });
        toast.success("Registration successful");
        navigate(from, { replace: true });
      } else {
        await authService.resetPasswordWithOtp({
          email: form.email,
          otp: form.otp,
          newPassword: form.newPassword,
        });
        toast.success("Password reset successful. Please sign in.");
        setMode("login");
        setStep("credentials");
        setForm((prev) => ({
          ...initialForm,
          email: prev.email,
        }));
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-center text-2xl font-semibold text-slate-900">Employee Management</h1>
        <p className="mt-1 text-center text-sm text-slate-500">{modeTitle}</p>

        <div className="mt-6 flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
            onClick={() => setMode("login")}
            disabled={sendingOtp || submitting}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
            onClick={() => setMode("register")}
            disabled={sendingOtp || submitting}
          >
            Register
          </button>
        </div>
        <button
          type="button"
          className={`mt-3 w-full rounded-lg py-2 text-sm font-medium transition ${
            mode === "forgot"
              ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          onClick={() => setMode("forgot")}
          disabled={sendingOtp || submitting}
        >
          Forgot Password
        </button>

        {step === "credentials" ? (
          <form onSubmit={requestOtp} className="mt-6 space-y-4">
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
                  required
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
            {mode !== "forgot" && (
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
            )}
            <Button type="submit" className="w-full" disabled={sendingOtp}>
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                Enter 6-digit OTP
              </label>
              <input
                id="otp"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-[0.3em] outline-none ring-brand-500 focus:ring-2"
                value={form.otp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))
                }
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                OTP sent to <span className="font-medium">{form.email}</span>
              </p>
            </div>
            {mode === "forgot" && (
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
                  value={form.newPassword}
                  onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting || form.otp.length !== 6}>
              {submitting
                ? "Verifying..."
                : mode === "login"
                  ? "Verify & Sign in"
                  : mode === "register"
                    ? "Verify & Create account"
                    : "Verify OTP & Reset password"}
            </Button>

            <button
              type="button"
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setStep("credentials")}
              disabled={submitting}
            >
              Change credentials / Resend OTP
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Two-step OTP is enabled for registration, login, and password reset.
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
