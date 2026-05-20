//Himanshu Dhaka: Worked on the booking page functionality and related user interface flow for the parking system.
//Note: Initially, the team shared code locally. Later, GitHub was adopted for proper version control and collaboration from Sprint 2 onwards.


const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parking: { type: mongoose.Schema.Types.ObjectId, ref: "Parking", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);