import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import type { User } from "@/types";
import Spinner from "@/components/ui/Spinner";

const roleColors: Record<User["role"], string> = {
  customer: "bg-gray-100 text-gray-700",
  vendor: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = () => {
    setIsLoading(true);
    adminApi
      .getAllUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (user: User) => {
    setUpdatingId(user.id);
    try {
      const updated = user.isActive
        ? await adminApi.deactivateUser(user.id)
        : await adminApi.activateUser(user.id);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Users
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleToggle(user)}
                      disabled={updatingId === user.id}
                      className={`text-xs font-medium disabled:opacity-50 ${
                        user.isActive
                          ? "text-red-500 hover:text-red-700"
                          : "text-primary-600 hover:text-primary-700"
                      }`}
                    >
                      {updatingId === user.id
                        ? "Updating…"
                        : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;