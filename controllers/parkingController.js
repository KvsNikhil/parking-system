const Parking = require("../models/parkingModel");

exports.addParking = async (req, res) => {
  try {
    const { location, totalSlots } = req.body;

    if (!location || !totalSlots) {
      return res.status(400).json({ 
        success: false, 
        message: "Location and totalSlots are required" 
      });
    }

    const parking = await Parking.create({
      location,
      totalSlots,
      availableSlots: totalSlots
    });

    res.status(201).json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllParking = async (req, res) => {
  try {
    const data = await Parking.find();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchParking = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ 
        success: false, 
        message: "Location query parameter is required" 
      });
    }

    const result = await Parking.find({
      location: { $regex: location, $options: "i" }
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};