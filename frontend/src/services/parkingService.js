import API from "./api";

export const getParkings = () => API.get("/parking");
export const searchParking = (location) => API.get(`/parking/search?location=${encodeURIComponent(location)}`);
export const addParking = (payload) => API.post("/parking", payload);
export const updateAvailability = (parkingId, payload) => API.put(`/admin/${parkingId}`, payload);
