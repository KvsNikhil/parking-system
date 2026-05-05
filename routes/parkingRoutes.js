const router = require("express").Router();
const {
  addParking,
  getAllParking,
  searchParking
} = require("../controllers/parkingController");

/**
 * @swagger
 * /api/parking:
 *   post:
 *     summary: Add parking location
 *     tags: [Parking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             location: "Downtown Parking"
 *             totalSlots: 50
 *     responses:
 *       201:
 *         description: Parking location added successfully
 *       400:
 *         description: Validation error
 */
router.post("/", addParking);

/**
 * @swagger
 * /api/parking:
 *   get:
 *     summary: Get all parking locations
 *     tags: [Parking]
 *     responses:
 *       200:
 *         description: List of all parking locations
 */
router.get("/", getAllParking);

/**
 * @swagger
 * /api/parking/search:
 *   get:
 *     summary: Search parking by location
 *     tags: [Parking]
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         description: Location to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Location query parameter required
 */
router.get("/search", searchParking);

module.exports = router;