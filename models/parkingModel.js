const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    totalSlots: { type: Number, required: true, min: 1 },
    availableSlots: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);