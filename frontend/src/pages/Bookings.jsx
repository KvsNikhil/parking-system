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

  const stats = bookings.reduce(
    (acc, booking) => {
      const status = booking.status || "active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { active: 0, completed: 0, cancelled: 0 }
  );

  const formatDateTime = (value) => new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-950 to-slate-900 p-8 text-white shadow-xl shadow-slate-200/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Bookings dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Your parking reservations</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Manage your bookings with one place view, see upcoming reservations, and cancel any slot if needed.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active</p>
              <p className="mt-3 text-3xl font-semibold">{stats.active}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Completed</p>
              <p className="mt-3 text-3xl font-semibold">{stats.completed}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Cancelled</p>
              <p className="mt-3 text-3xl font-semibold">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">My Bookings</h2>
            <p className="text-sm text-slate-500">All reservations made with your account.</p>
          </div>
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {bookings.length} total bookings
          </span>
        </div>

        <div className="space-y-4">
          {message && (
            <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700 shadow-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            You have no bookings yet. Book a parking slot to see reservations here.
          </div>
        ) : (
          <div className="grid gap-5">
            {bookings.map((booking) => (
              <div key={booking._id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-950 px-6 py-5 text-white">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Parking location</p>
                      <p className="mt-1 text-xl font-semibold">{booking.parking?.location || "Unknown location"}</p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      booking.status === "cancelled"
                        ? "bg-rose-100 text-rose-700"
                        : booking.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {booking.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Booking window</p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Parking details</p>
                    <p className="text-sm text-slate-700">Total slots: {booking.parking?.totalSlots ?? "—"}</p>
                    <p className="text-sm text-slate-700">Available now: {booking.parking?.availableSlots ?? "—"}</p>
                    <p className="text-sm text-slate-700">Created: {formatDateTime(booking.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">Booked by {user?.name || user?.email || "you"}</p>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="inline-flex items-center justify-center rounded-3xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={booking.status === "cancelled" || booking.status === "completed"}
                  >
                    {booking.status === "active" ? "Cancel booking" : "Cannot cancel"}
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
