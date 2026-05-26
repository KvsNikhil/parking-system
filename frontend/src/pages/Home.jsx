import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-20 shadow-sm sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
          Smart Parking made easy
        </span>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Find parking, manage bookings, and run your lot with confidence.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Browse live parking locations, book available slots, and use the admin
          dashboard to manage users and availability from one polished interface.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/parkings"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Browse Parkings
          </Link>
          {user ? (
            <Link
              to="/bookings"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400"
            >
              My Bookings
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full border border-blue-600 bg-white px-8 py-3 text-base font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Create Account
            </Link>
          )}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Search quickly",
              description: "Find parking slots by location and availability in seconds.",
            },
            {
              title: "Book with ease",
              description: "Reserve parking and manage your active bookings from one place.",
            },
            {
              title: "Admin control",
              description: "Owners can review users and update parking availability securely.",
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;