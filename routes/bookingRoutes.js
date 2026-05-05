const router = require("express").Router();
const {
  bookSlot,
  getUserBookings,
  cancelBooking
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Book a parking slot
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             parkingId: "64f123abc123"
 *             startTime: "2025-01-20T10:00:00Z"
 *             endTime: "2025-01-20T12:00:00Z"
 *     responses:
 *       201:
 *         description: Booking successful
 *       400:
 *         description: Bad request
 */
router.post("/", protect, bookSlot);

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get logged-in user bookings
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/", protect, getUserBookings);

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.delete("/:id", protect, cancelBooking);

module.exports = router;