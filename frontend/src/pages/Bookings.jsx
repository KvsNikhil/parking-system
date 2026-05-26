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
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">My Bookings</h2>
            <p className="text-sm text-slate-500">Review upcoming reservations and cancel if needed.</p>
          </div>
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            {bookings.length} active bookings
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {message && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
          {error && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            You have no active bookings.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{booking.parking?.location || "Unknown parking"}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <p className="text-sm text-slate-600">Start: {new Date(booking.startTime).toLocaleString()}</p>
                      <p className="text-sm text-slate-600">End: {new Date(booking.endTime).toLocaleString()}</p>
                    </div>
                    <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                      Status: {booking.status || "active"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Cancel booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Bookings;
