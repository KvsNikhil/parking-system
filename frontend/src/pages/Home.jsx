import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-bold text-blue-600">
        Smart Parking System
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Manage parking locations, search for open slots, book your parking and
        keep track of your bookings in one place.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {user ? (
          <>
            <Link to="/parkings" className="bg-blue-600 text-white rounded px-6 py-3">
              Browse Parkings
            </Link>
            <Link to="/bookings" className="border border-blue-600 text-blue-600 rounded px-6 py-3">
              My Bookings
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-600 text-white rounded px-6 py-3">
              Login
            </Link>
            <Link to="/register" className="border border-blue-600 text-blue-600 rounded px-6 py-3">
              Create Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;