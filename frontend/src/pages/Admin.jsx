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
        <p className="text-gray-700">Please login as an admin to manage availability.</p>
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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        {message && <div className="mb-4 text-green-700 bg-green-100 p-3 rounded">{message}</div>}
        {error && <div className="mb-4 text-red-700 bg-red-100 p-3 rounded">{error}</div>}

        <div className="space-y-4">
          {parkings.map((parking) => (
            <div key={parking._id} className="border rounded p-4">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <div>
                  <p className="font-semibold">{parking.location}</p>
                  <p className="text-sm text-gray-600">Total slots: {parking.totalSlots}</p>
                  <p className="text-sm text-gray-600">Available slots: {parking.availableSlots}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    min="0"
                    max={parking.totalSlots}
                    value={availability[parking._id] ?? parking.availableSlots}
                    onChange={(e) => handleAvailabilityChange(parking._id, e.target.value)}
                    className="w-28 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleUpdate(parking._id)}
                    className="bg-blue-600 text-white rounded px-4 py-2"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Registered Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="grid gap-3">
            {users.map((userItem) => (
              <div key={userItem._id} className="border p-3 rounded">
                <p className="font-semibold">{userItem.name}</p>
                <p className="text-sm text-gray-600">{userItem.email}</p>
                <p className="text-sm text-gray-600">Role: {userItem.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
