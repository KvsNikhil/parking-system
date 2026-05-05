const Booking = require("../models/bookingModel");
const Parking = require("../models/parkingModel");

/**
 * @desc    Book a parking slot
 * @route   POST /api/booking
 * @access  Private
 */
exports.bookSlot = async (req, res) => {
  try {
    const { parkingId, startTime, endTime } = req.body;

    // 🔍 Validate input
    if (!parkingId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Parking ID, startTime, and endTime are required"
      });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time"
      });
    }

    // 🔍 Find parking
    const parking = await Parking.findById(parkingId);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found"
      });
    }

    // 🚫 Check availability
    if (parking.availableSlots <= 0) {
      return res.status(400).json({
        success: false,
        message: "No slots available"
      });
    }

    // ⚠️ Prevent double booking (optional but HD level)
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      parking: parkingId,
      status: "active"
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You already have an active booking at this location"
      });
    }

    // ➖ Reduce slot
    parking.availableSlots -= 1;
    await parking.save();

    // ✅ Create booking
    const booking = await Booking.create({
      user: req.user.id,
      parking: parkingId,
      startTime,
      endTime
    });

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: booking
    });

  } catch (error) {
    console.error("Booking Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


/**
 * @desc    Get logged-in user's bookings
 * @route   GET /api/booking
 * @access  Private
 */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("parking", "location availableSlots totalSlots");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error("Fetch Booking Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


/**
 * @desc    Cancel a booking (optional HD feature)
 * @route   DELETE /api/booking/:id
 * @access  Private
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // 🔒 Ensure user owns booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // ➕ Restore slot
    const parking = await Parking.findById(booking.parking);
    if (parking) {
      parking.availableSlots += 1;
      await parking.save();
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};