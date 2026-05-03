import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type AdminCategory = {
  id: number;
  name: string;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
};

type SystemLog = {
  id: number;
  action: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
};

type CategoryFormState = {
  name: string;
  description: string;
  isDefault: boolean;
};

const emptyCategoryForm: CategoryFormState = {
  name: "",
  description: "",
  isDefault: false,
};

function toMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? "Request failed.";
  }
  return "Request failed.";
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [roleEdits, setRoleEdits] = useState<Record<number, "USER" | "ADMIN">>({});
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const [usersResponse, categoriesResponse, logsResponse] = await Promise.all([
        client.get<{ users: AdminUser[] }>("/admin/users"),
        client.get<{ categories: AdminCategory[] }>("/admin/categories"),
        client.get<{ logs: SystemLog[] }>("/admin/system-logs"),
      ]);
      const nextUsers = usersResponse.data.users ?? [];
      const nextCategories = categoriesResponse.data.categories ?? [];
      const nextLogs = logsResponse.data.logs ?? [];
      setUsers(nextUsers);
      setCategories(nextCategories);
      setLogs(nextLogs);
      setRoleEdits(
        nextUsers.reduce<Record<number, "USER" | "ADMIN">>((acc, item) => {
          acc[item.id] = item.role;
          return acc;
        }, {})
      );
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && isAdmin) {
      void loadAdminData();
    }
  }, [loading, isAdmin, loadAdminData]);

  const handleRoleEdit = (id: number, role: "USER" | "ADMIN") => {
    setRoleEdits((prev) => ({ ...prev, [id]: role }));
  };

  const handleUpdateRole = async (id: number) => {
    const nextRole = roleEdits[id];
    if (!nextRole) {
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await client.put(`/admin/users/${id}/role`, { role: nextRole });
      setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, role: nextRole } : item)));
      setMessage("User role updated.");
    } catch (err) {
      setError(toMessage(err));
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmed = window.confirm("Delete this user? This cannot be undone.");
    if (!confirmed) {
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await client.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      setMessage("User deleted.");
    } catch (err) {
      setError(toMessage(err));
    }
  };

  const handleCategoryChange = (field: keyof CategoryFormState, value: string | boolean) => {
    setCategoryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryEdit = (category: AdminCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description ?? "",
      isDefault: category.isDefault,
    });
  };

  const handleCategorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!categoryForm.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      if (editingCategoryId) {
        await client.put(`/admin/categories/${editingCategoryId}`, {
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() || null,
          isDefault: categoryForm.isDefault,
        });
        setMessage("Category updated.");
      } else {
        await client.post("/admin/categories", {
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() || null,
          isDefault: categoryForm.isDefault,
        });
        setMessage("Category created.");
      }
      setCategoryForm(emptyCategoryForm);
      setEditingCategoryId(null);
      await loadAdminData();
    } catch (err) {
      setError(toMessage(err));
    }
  };

  const handleCategoryDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this category? This cannot be undone.");
    if (!confirmed) {
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await client.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      setMessage("Category deleted.");
    } catch (err) {
      setError(toMessage(err));
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  };

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [logs]
  );

  if (loading) {
    return (
      <section className="page">
        <span className="pill">Admin only</span>
        <h1>Admin console</h1>
        <p className="page-subtitle">Loading admin access...</p>
      </section>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="page">
      <span className="pill">Admin only</span>
      <h1>Admin console</h1>
      <p className="page-subtitle">Manage users, categories, and audit logs.</p>
      {isLoading ? <p className="page-subtitle">Loading admin data...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      <div className="page-section">
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Users</h2>
            <p className="page-subtitle">Manage accounts and roles.</p>
          </div>
          {users.length === 0 ? (
            <p className="page-subtitle">No users found.</p>
          ) : (
            <div className="table">
              <div className="table-row table-head">
                <div className="table-cell">Name</div>
                <div className="table-cell">Email</div>
                <div className="table-cell">Role</div>
                <div className="table-cell">Created</div>
                <div className="table-cell">Actions</div>
              </div>
              {users.map((item) => (
                <div key={item.id} className="table-row">
                  <div className="table-cell">
                    {item.name}
                    <div className="page-subtitle">ID: {item.id}</div>
                  </div>
                  <div className="table-cell">{item.email}</div>
                  <div className="table-cell">
                    <select
                      className="form-input"
                      value={roleEdits[item.id] ?? item.role}
                      onChange={(event) =>
                        handleRoleEdit(item.id, event.target.value as "USER" | "ADMIN")
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div className="table-cell">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="table-actions">
                    <button type="button" onClick={() => handleUpdateRole(item.id)}>
                      Update
                    </button>
                    <button type="button" className="danger" onClick={() => handleDeleteUser(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Categories</h2>
            <p className="page-subtitle">Create and edit habit categories.</p>
          </div>
          <form className="form compact" onSubmit={handleCategorySubmit}>
            <label className="form-label">
              Name
              <input
                className="form-input"
                value={categoryForm.name}
                onChange={(event) => handleCategoryChange("name", event.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Description
              <input
                className="form-input"
                value={categoryForm.description}
                onChange={(event) => handleCategoryChange("description", event.target.value)}
              />
            </label>
            <label className="form-label checkbox">
              <input
                type="checkbox"
                checked={categoryForm.isDefault}
                onChange={(event) => handleCategoryChange("isDefault", event.target.checked)}
              />
              Default category
            </label>
            <div className="form-actions">
              <button type="submit">{editingCategoryId ? "Save" : "Create"}</button>
              {editingCategoryId ? (
                <button type="button" className="secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          {categories.length === 0 ? (
            <p className="page-subtitle">No categories yet.</p>
          ) : (
            <div className="admin-grid">
              {categories.map((item) => (
                <div key={item.id} className="page-card">
                  <strong>{item.name}</strong>
                  <span>{item.description || "No description"}</span>
                  <span>Default: {item.isDefault ? "Yes" : "No"}</span>
                  <div className="form-actions">
                    <button type="button" onClick={() => handleCategoryEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleCategoryDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>System logs</h2>
            <p className="page-subtitle">Recent admin activity and audit trail.</p>
          </div>
          {sortedLogs.length === 0 ? (
            <p className="page-subtitle">No logs recorded yet.</p>
          ) : (
            <div className="admin-grid">
              {sortedLogs.map((item) => (
                <div key={item.id} className="page-card">
                  <strong>{item.action}</strong>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <span>
                    User: {item.user ? `${item.user.name} (${item.user.email})` : "System"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
