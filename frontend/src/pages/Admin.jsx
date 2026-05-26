import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getParkings, updateAvailability } from "../services/parkingService";
import { getUsers } from "../services/authService";

function Admin() {
  const { user } = useContext(AuthContext);
  const [parkings, setParkings] = useState([]);
  const [users, setUsers] = useState([]);
  const [availability, setAvailability] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadParkings = async () => {
    try {
      const response = await getParkings();
      setParkings(response.data.data || []);
      const initialValues = {};
      (response.data.data || []).forEach((item) => {
        initialValues[item._id] = item.availableSlots;
      });
      setAvailability(initialValues);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load parkings.");
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      loadParkings();
      loadUsers();
    }
  }, [user]);

  const handleAvailabilityChange = (parkingId, value) => {
    setAvailability({ ...availability, [parkingId]: value });
  };

  const handleUpdate = async (parkingId) => {
    setMessage(null);
    setError(null);

    try {
      const value = Number(availability[parkingId]);
      await updateAvailability(parkingId, { availableSlots: value });
      setMessage("Availability updated successfully.");
      loadParkings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update availability.");
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Admin</h2>
        <p className="text-gray-700">Please login as an admin to manage the system.</p>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Admin</h2>
        <p className="text-gray-700">Admin access required. You are logged in as {user.role}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Owner control panel for user management and parking availability.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{users.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Parking Locations</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{parkings.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{user.name}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Registered Users</h3>
              <p className="text-sm text-slate-500">Review platform users and their roles.</p>
            </div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              {users.length} users
            </span>
          </div>

          {users.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No registered users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="border-b border-slate-200 text-sm uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-4 px-3">Name</th>
                    <th className="py-4 px-3">Email</th>
                    <th className="py-4 px-3">Role</th>
                    <th className="py-4 px-3">Joined</th>
                    <th className="py-4 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr key={userItem._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-3 font-medium text-slate-700">{userItem.name}</td>
                      <td className="py-4 px-3 text-sm text-slate-600">{userItem.email}</td>
                      <td className="py-4 px-3 text-sm text-slate-600">{userItem.role}</td>
                      <td className="py-4 px-3 text-sm text-slate-600">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-3">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Parking Availability</h3>
            <p className="text-sm text-slate-500">Update parking slot counts across locations.</p>
          </div>
          {message && <div className="mb-4 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
          {error && <div className="mb-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

          <div className="space-y-4">
            {parkings.map((parking) => (
              <div key={parking._id} className="rounded-3xl border border-slate-200 p-4 shadow-sm">
                <div className="mb-4">
                  <p className="font-semibold text-slate-900">{parking.location}</p>
                  <p className="text-sm text-slate-500">Total slots: {parking.totalSlots} · Available: {parking.availableSlots}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="number"
                    min="0"
                    max={parking.totalSlots}
                    value={availability[parking._id] ?? parking.availableSlots}
                    onChange={(e) => handleAvailabilityChange(parking._id, e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-32"
                  />
                  <button
                    onClick={() => handleUpdate(parking._id)}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
