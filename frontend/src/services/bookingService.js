import API from "./api";

export const bookSlot = (payload) => API.post("/booking", payload);
export const getBookings = () => API.get("/booking");
export const cancelBooking = (bookingId) => API.delete(`/booking/${bookingId}`);
