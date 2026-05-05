const router = require("express").Router();
const { updateAvailability } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/admin/{id}:
 *   put:
 *     summary: Update parking availability (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Parking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             availableSlots: 5
 *     responses:
 *       200:
 *         description: Parking updated successfully
 *       403:
 *         description: Admin access required
 */
router.put("/:id", protect, adminOnly, updateAvailability);

module.exports = router;