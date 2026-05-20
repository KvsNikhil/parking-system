import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getBookings, cancelBooking } from "../services/bookingService";

function Bookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBookings();
      setBookings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const handleCancel = async (id) => {
    setMessage(null);
    setError(null);
    try {
      await cancelBooking(id);
      setMessage("Booking cancelled successfully.");
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel booking.");
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">My Bookings</h2>
        <p className="text-gray-700">Please login first to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
        {message && <div className="mb-4 text-green-700 bg-green-100 p-3 rounded">{message}</div>}
        {error && <div className="mb-4 text-red-700 bg-red-100 p-3 rounded">{error}</div>}

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">You have no active bookings.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="border rounded p-4">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-semibold">{booking.parking?.location || "Unknown parking"}</p>
                    <p className="text-sm text-gray-600">Start: {new Date(booking.startTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">End: {new Date(booking.endTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Status: {booking.status || "active"}</p>
                  </div>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="bg-red-600 text-white rounded px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
