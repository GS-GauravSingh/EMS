import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";
import Button from "../components/Button.jsx";
import * as userService from "../services/userService.js";

function getErrorMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong";
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleToggleRole(user) {
    if (user.isFirstUser) return;
    const nextRole = user.role === "admin" ? "employee" : "admin";
    setUpdatingId(user.id);
    try {
      const updated = await userService.updateUserRole(user.id, nextRole);
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`${updated.name} is now ${updated.role}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Manage User Roles</h1>
        <p className="text-slate-600">
          Admins can change other users between employee and admin.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 font-medium text-slate-700">Role</th>
                <th className="px-4 py-3 font-medium text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {user.name}
                      {user.isFirstUser && (
                        <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                          First Admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600">{user.role}</td>
                    <td className="px-4 py-3">
                      {user.isFirstUser ? (
                        <span className="text-xs text-slate-500">Role locked</span>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          className="!px-3 !py-1.5"
                          disabled={updatingId === user.id}
                          onClick={() => handleToggleRole(user)}
                        >
                          {updatingId === user.id
                            ? "Updating..."
                            : user.role === "admin"
                              ? "Set as Employee"
                              : "Set as Admin"}
                        </Button>
                      )}
                    </td>
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
