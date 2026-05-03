import { NavLink } from "react-router-dom";

const getNavClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? " active" : ""}`;

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">Habit Tracker</div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={getNavClass}>
          Dashboard
        </NavLink>
        <NavLink to="/habits" className={getNavClass}>
          Habits
        </NavLink>
        <NavLink to="/admin" className={getNavClass}>
          Admin
        </NavLink>
        <NavLink to="/login" className={getNavClass}>
          Login
        </NavLink>
        <NavLink to="/register" className={getNavClass}>
          Register
        </NavLink>
      </div>
    </nav>
  );
}
