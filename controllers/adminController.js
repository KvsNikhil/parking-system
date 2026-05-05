const Parking = require("../models/parkingModel");

exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availableSlots } = req.body;

    if (availableSlots === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "availableSlots is required" 
      });
    }

    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ 
        success: false, 
        message: "Parking not found" 
      });
    }

    if (availableSlots < 0 || availableSlots > parking.totalSlots) {
      return res.status(400).json({ 
        success: false, 
        message: `availableSlots must be between 0 and ${parking.totalSlots}` 
      });
    }

    parking.availableSlots = availableSlots;
    await parking.save();

    res.json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};