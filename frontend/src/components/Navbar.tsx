import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getNavClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? " active" : ""}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="nav-brand">
        Habit Tracker
      </NavLink>
      <div className="nav-links">
        <NavLink to="/dashboard" className={getNavClass}>
          Dashboard
        </NavLink>
        <NavLink to="/habits" className={getNavClass}>
          Habits
        </NavLink>
        {user?.role === "ADMIN" ? (
          <NavLink to="/admin" className={getNavClass}>
            Admin
          </NavLink>
        ) : null}
        {user ? (
          <button type="button" className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className={getNavClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={getNavClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
