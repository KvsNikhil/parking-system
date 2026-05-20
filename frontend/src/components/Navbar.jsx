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
    <nav className="bg-blue-600 text-white p-4 flex flex-wrap justify-between items-center gap-3">
      <div>
        <Link to="/" className="font-bold text-xl">
          Parking System
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/parkings">Parkings</Link>
            <Link to="/bookings">My Bookings</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="text-sm bg-white text-blue-600 rounded px-3 py-1">
              Logout
            </button>
            <span className="text-sm">{user.name}</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;