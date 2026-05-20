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

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Search Parkings</h2>
          <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 border rounded"
              placeholder="Search by location"
            />
            <button className="bg-blue-600 text-white rounded px-5 py-3" type="submit">
              Search
            </button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add Parking Location</h2>
          <form onSubmit={handleAddParking} className="space-y-3">
            <input
              name="location"
              value={newParking.location}
              onChange={handleNewChange}
              className="w-full p-3 border rounded"
              placeholder="Location"
            />
            <input
              name="totalSlots"
              value={newParking.totalSlots}
              onChange={handleNewChange}
              className="w-full p-3 border rounded"
              placeholder="Total slots"
              type="number"
              min="1"
            />
            <button className="w-full bg-green-600 text-white rounded px-5 py-3" type="submit">
              Add Parking
            </button>
          </form>
        </section>
      </div>

      {message && <div className="text-green-700 bg-green-100 p-4 rounded">{message}</div>}
      {error && <div className="text-red-700 bg-red-100 p-4 rounded">{error}</div>}

      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Available Parking Locations</h2>
        {parkings.length === 0 ? (
          <p className="text-gray-600">No parking locations found.</p>
        ) : (
          <div className="grid gap-4">
            {parkings.map((parking) => (
              <div key={parking._id} className="border rounded p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{parking.location}</h3>
                    <p className="text-sm text-gray-600">Total slots: {parking.totalSlots}</p>
                    <p className="text-sm text-gray-600">Available slots: {parking.availableSlots}</p>
                  </div>
                  <button
                    onClick={() => handleSelectParking(parking)}
                    className="self-start bg-blue-600 text-white rounded px-4 py-2"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedParking && (
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Book {selectedParking.location}</h2>
          <form onSubmit={handleBookingSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700">Start Time</label>
              <input
                name="startTime"
                type="datetime-local"
                value={bookingData.startTime}
                onChange={handleBookingChange}
                className="w-full p-3 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">End Time</label>
              <input
                name="endTime"
                type="datetime-local"
                value={bookingData.endTime}
                onChange={handleBookingChange}
                className="w-full p-3 border rounded"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button className="bg-green-600 text-white rounded px-5 py-3" type="submit">
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setSelectedParking(null)}
                className="bg-gray-200 text-gray-700 rounded px-5 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default Parkings;
