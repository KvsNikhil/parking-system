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
    <div className="relative space-y-10 max-w-6xl mx-auto px-4 py-8">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50 opacity-80" />
      {/* Section: Admin Banner */}
      {user?.role === "admin" && (
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-8 text-blue-900 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Admin view</h2>
              <p className="mt-1 text-base text-blue-800">
                You are viewing the parking catalog as an owner. Booking controls remain disabled for admin users.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-200 px-5 py-2 text-base font-semibold shadow-sm">
              Manage locations & availability
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="hidden lg:block border-r border-slate-200 absolute left-1/2 top-0 h-full -translate-x-1/2" aria-hidden="true" />
        <section className="space-y-8 rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Parking Search</h2>
              <p className="text-base text-slate-500">Find available parking locations by city or area.</p>
            </div>
            <form onSubmit={handleSearch} className="flex w-full gap-3 sm:w-auto sm:min-w-[320px]">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                placeholder="Search by location"
              />
              <button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-600" type="submit">
                <span className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                  Search
                </span>
              </button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 p-6 shadow-sm flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A4.5 4.5 0 008 6.75v3.75m8.25 0a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 01-4.5 0m0 0V6.75m0 3.75a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 01-4.5 0" />
                </svg>
              </span>
              <div>
                <p className="text-sm text-slate-500">Locations</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{totalLocations}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-slate-50 p-6 shadow-sm flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
              </span>
              <div>
                <p className="text-sm text-slate-500">Total slots</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{totalSlots}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-slate-50 p-6 shadow-sm flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-sm text-slate-500">Available now</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{totalAvailable}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {message && <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
            {error && <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold text-slate-900 tracking-tight">Available Parking Locations</h3>
            {parkings.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500 text-lg">
                No parking locations found yet. Add a new location or search again.
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {parkings.map((parking, idx) => (
                  <div
                    key={parking._id}
                    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden"
                  >
                    {/* 'New' badge for recently added locations (first 2 as example) */}
                    {idx < 2 && (
                      <span className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-3 py-1 text-xs font-bold text-white shadow-md animate-pulse">
                        New
                      </span>
                    )}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6 text-blue-500'><path strokeLinecap='round' strokeLinejoin='round' d='M16.5 10.5V6.75A4.5 4.5 0 008 6.75v3.75m8.25 0a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 01-4.5 0m0 0V6.75m0 3.75a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 01-4.5 0' /></svg>
                          {parking.location}
                        </h4>
                        <p className="mt-2 text-base text-slate-600 flex items-center gap-1">
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5 text-green-500'><path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6l4 2' /></svg>
                          Total slots: <span className="font-semibold ml-1">{parking.totalSlots}</span>
                        </p>
                        <p className="text-base text-slate-600 flex items-center gap-1">
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5 text-emerald-500'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg>
                          Available slots: <span className="font-semibold ml-1">{parking.availableSlots}</span>
                        </p>
                      </div>
                      <span className={`inline-flex rounded-full px-4 py-1.5 text-base font-semibold shadow-sm ${parking.availableSlots > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} transition-colors duration-200`}>
                        {parking.availableSlots > 0 ? 'Open' : 'Full'}
                      </span>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      {user?.role !== "admin" ? (
                        <button
                          onClick={() => handleSelectParking(parking)}
                          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 text-base font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-600 hover:scale-105 group-hover:scale-105"
                        >
                          Book slot
                        </button>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-5 py-2 text-base font-semibold text-slate-700">
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
          <section className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Parking Location</h2>
              <p className="mt-2 text-base text-slate-500">Create a new location so users can book it.</p>
            </div>

            <form onSubmit={handleAddParking} className="space-y-6">
              <div>
                <label className="mb-2 block text-base font-semibold text-slate-700">Location name</label>
                <input
                  name="location"
                  value={newParking.location}
                  onChange={handleNewChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                  placeholder="E.g. City Center Parking"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-slate-700">Total slots</label>
                <input
                  name="totalSlots"
                  value={newParking.totalSlots}
                  onChange={handleNewChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                  placeholder="10"
                  type="number"
                  min="1"
                />
              </div>

              <button className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-base font-bold text-white shadow-md transition hover:from-green-700 hover:to-emerald-600" type="submit">
                Add location
              </button>
            </form>
          </section>
        )}
      </div>

      {selectedParking && user?.role !== "admin" && (
        <section className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Book {selectedParking.location}</h2>
          <p className="mt-2 text-base text-slate-500">Choose your reservation window and confirm your booking.</p>

          <form onSubmit={handleBookingSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-base font-semibold text-slate-700">Start time</label>
              <input
                name="startTime"
                type="datetime-local"
                value={bookingData.startTime}
                onChange={handleBookingChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-base font-semibold text-slate-700">End time</label>
              <input
                name="endTime"
                type="datetime-local"
                value={bookingData.endTime}
                onChange={handleBookingChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
              />
            </div>
            <div className="flex gap-4 md:col-span-2 flex-wrap mt-2">
              <button className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 text-base font-bold text-white shadow-md transition hover:from-green-700 hover:to-emerald-600" type="submit">
                Confirm booking
              </button>
              <button
                type="button"
                onClick={() => setSelectedParking(null)}
                className="rounded-xl border border-slate-300 bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {user?.role === "admin" && selectedParking && (
        <section className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin mode</h2>
          <p className="mt-2 text-base text-slate-600">
            Admin users cannot create bookings from this page. Use the dashboard to manage availability and location data.
          </p>
          <button
            type="button"
            onClick={() => setSelectedParking(null)}
            className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-600"
          >
            Close
          </button>
        </section>
      )}
    </div>
  );
}

export default Parkings;
