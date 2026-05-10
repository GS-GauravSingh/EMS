import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-300">404</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
