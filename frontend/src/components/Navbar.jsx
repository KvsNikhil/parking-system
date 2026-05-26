import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-3 text-slate-900 font-semibold text-2xl">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">P</span>
          Parking System
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-slate-700">
          <Link to="/" className="transition hover:text-slate-900">Home</Link>
          <Link to="/parkings" className="transition hover:text-slate-900">Parkings</Link>
          {user ? (
            <>
              {user.role !== "admin" && <Link to="/bookings" className="transition hover:text-slate-900">My Bookings</Link>}
              <Link to="/profile" className="transition hover:text-slate-900">Account</Link>
              {user.role === "admin" && <Link to="/admin" className="transition hover:text-slate-900">Admin</Link>}
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                {user.name}
                {user.role === "admin" && " · Admin"}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-300 px-4 py-2 transition hover:border-slate-400">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;