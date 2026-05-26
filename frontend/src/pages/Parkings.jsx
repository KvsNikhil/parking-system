import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { getParkings, searchParking, addParking } from "../services/parkingService";
import { bookSlot } from "../services/bookingService";

function Parkings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newParking, setNewParking] = useState({ location: "", totalSlots: "" });
  const [selectedParking, setSelectedParking] = useState(null);
  const [bookingData, setBookingData] = useState({ startTime: "", endTime: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadParkings = async () => {
    try {
      const response = await getParkings();
      setParkings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load parkings.");
    }
  };

  useEffect(() => {
    loadParkings();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!searchTerm.trim()) {
      return loadParkings();
    }

    try {
      const response = await searchParking(searchTerm);
      setParkings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed.");
    }
  };

  const handleNewChange = (e) => {
    setNewParking({ ...newParking, [e.target.name]: e.target.value });
  };

  const handleAddParking = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await addParking({
        location: newParking.location,
        totalSlots: Number(newParking.totalSlots)
      });
      setMessage("Parking location added successfully.");
      setNewParking({ location: "", totalSlots: "" });
      loadParkings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add parking.");
    }
  };

  const handleSelectParking = (parking) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSelectedParking(parking);
    setBookingData({ startTime: "", endTime: "" });
    setMessage(null);
    setError(null);
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedParking) {
      setError("Select a parking location to book.");
      return;
    }

    try {
      await bookSlot({
        parkingId: selectedParking._id,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime
      });
      setMessage("Booking successful.");
      setSelectedParking(null);
      loadParkings();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    }
  };

  const totalLocations = parkings.length;
  const totalSlots = parkings.reduce((sum, parking) => sum + (parking.totalSlots || 0), 0);
  const totalAvailable = parkings.reduce((sum, parking) => sum + (parking.availableSlots || 0), 0);

  return (
    <div className="space-y-8">
      {user?.role === "admin" && (
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-blue-900 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Admin view</h2>
              <p className="mt-1 text-sm text-blue-800">
                You are viewing the parking catalog as an owner. Booking controls remain disabled for admin users.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900">
              Manage locations & availability
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Parking search</h2>
              <p className="text-sm text-slate-500">Search for available parking locations by city or area.</p>
            </div>
            <form onSubmit={handleSearch} className="flex w-full gap-3 sm:w-auto sm:min-w-[320px]">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Search by location"
              />
              <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Locations</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{totalLocations}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total slots</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{totalSlots}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Available now</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{totalAvailable}</p>
            </div>
          </div>

          <div className="space-y-4">
            {message && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
            {error && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Available Parking Locations</h3>
            {parkings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No parking locations found yet. Add a new location or search again.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {parkings.map((parking) => (
                  <div key={parking._id} className="rounded-3xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{parking.location}</h4>
                        <p className="mt-2 text-sm text-slate-600">Total slots: {parking.totalSlots}</p>
                        <p className="text-sm text-slate-600">Available slots: {parking.availableSlots}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${parking.availableSlots > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {parking.availableSlots > 0 ? 'Open' : 'Full'}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {user?.role !== "admin" ? (
                        <button
                          onClick={() => handleSelectParking(parking)}
                          className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Book slot
                        </button>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                          Admin view
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {user?.role === "admin" && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Add Parking Location</h2>
              <p className="mt-2 text-sm text-slate-500">Create a new location so users can book it.</p>
            </div>

            <form onSubmit={handleAddParking} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Location name</label>
                <input
                  name="location"
                  value={newParking.location}
                  onChange={handleNewChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="E.g. City Center Parking"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Total slots</label>
                <input
                  name="totalSlots"
                  value={newParking.totalSlots}
                  onChange={handleNewChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="10"
                  type="number"
                  min="1"
                />
              </div>

              <button className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700" type="submit">
                Add location
              </button>
            </form>
          </section>
        )}
      </div>

      {selectedParking && user?.role !== "admin" && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Book {selectedParking.location}</h2>
          <p className="mt-2 text-sm text-slate-500">Choose your reservation window and confirm your booking.</p>

          <form onSubmit={handleBookingSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start time</label>
              <input
                name="startTime"
                type="datetime-local"
                value={bookingData.startTime}
                onChange={handleBookingChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">End time</label>
              <input
                name="endTime"
                type="datetime-local"
                value={bookingData.endTime}
                onChange={handleBookingChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex gap-3 md:col-span-2 flex-wrap">
              <button className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700" type="submit">
                Confirm booking
              </button>
              <button
                type="button"
                onClick={() => setSelectedParking(null)}
                className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {user?.role === "admin" && selectedParking && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Admin mode</h2>
          <p className="mt-2 text-slate-600">
            Admin users cannot create bookings from this page. Use the dashboard to manage availability and location data.
          </p>
          <button
            type="button"
            onClick={() => setSelectedParking(null)}
            className="mt-4 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Close
          </button>
        </section>
      )}
    </div>
  );
}

export default Parkings;
