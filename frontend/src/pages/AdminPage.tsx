import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="page">
        <span className="pill">Admin only</span>
        <h1>Admin console</h1>
        <p className="page-subtitle">Loading admin access...</p>
      </section>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="page">
      <span className="pill">Admin only</span>
      <h1>Admin console</h1>
      <p className="page-subtitle">
        User management, categories, and system logs will be available here.
      </p>
      <div className="page-grid">
        <div className="page-card">
          <strong>Users</strong>
          <span>List accounts and roles</span>
        </div>
        <div className="page-card">
          <strong>Categories</strong>
          <span>Manage default categories</span>
        </div>
        <div className="page-card">
          <strong>System logs</strong>
          <span>Audit actions and changes</span>
        </div>
      </div>
    </section>
  );
}
