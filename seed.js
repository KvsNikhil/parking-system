require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("./models/userModel");
const Parking = require("./models/parkingModel");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Parking.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "System Admin",
      email: "admin@parking.com",
      password: adminPassword,
      role: "admin"
    });
    console.log("👑 Admin user created:", admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await User.create({
      name: "John Doe",
      email: "user@parking.com",
      password: userPassword,
      role: "user"
    });
    console.log("👤 Regular user created:", user.email);

    // Create parking locations
    const parkingLocations = [
      {
        location: "Downtown Central Parking",
        totalSlots: 100,
        availableSlots: 85
      },
      {
        location: "Mall Plaza Parking",
        totalSlots: 200,
        availableSlots: 150
      },
      {
        location: "Airport Terminal Parking",
        totalSlots: 500,
        availableSlots: 320
      },
      {
        location: "Hospital Emergency Parking",
        totalSlots: 50,
        availableSlots: 25
      },
      {
        location: "University Campus Parking",
        totalSlots: 300,
        availableSlots: 180
      }
    ];

    const createdParking = await Parking.insertMany(parkingLocations);
    console.log(`🏗️ Created ${createdParking.length} parking locations`);

    // Display created data
    console.log("\n📊 SEEDING COMPLETE!");
    console.log("=====================================");
    console.log("ADMIN ACCOUNT:");
    console.log("Email: admin@parking.com");
    console.log("Password: admin123");
    console.log("Role: admin");
    console.log("");
    console.log("USER ACCOUNT:");
    console.log("Email: user@parking.com");
    console.log("Password: user123");
    console.log("Role: user");
    console.log("");
    console.log("PARKING LOCATIONS:");
    createdParking.forEach((parking, index) => {
      console.log(`${index + 1}. ${parking.location} - ${parking.availableSlots}/${parking.totalSlots} slots available`);
    });
    console.log("=====================================");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => {
  seedData();
});