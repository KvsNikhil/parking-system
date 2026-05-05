require("dotenv").config();
const mongoose = require("mongoose");

// Import models to ensure they're registered
const User = require("./models/userModel");
const Parking = require("./models/parkingModel");
const Booking = require("./models/bookingModel");

const showDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB\n");

    console.log("📊 DATABASE COLLECTIONS & DATA:");
    console.log("=====================================\n");

    // Show Users
    console.log("👥 USERS COLLECTION:");
    const users = await User.find({}, { password: 0 }); // Exclude password field
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    console.log(`Total: ${users.length} users\n`);

    // Show Parking
    console.log("🏗️ PARKING COLLECTION:");
    const parking = await Parking.find({});
    parking.forEach((p, index) => {
      console.log(`${index + 1}. ${p.location}`);
      console.log(`   Slots: ${p.availableSlots}/${p.totalSlots} available`);
      console.log(`   ID: ${p._id}\n`);
    });
    console.log(`Total: ${parking.length} parking locations\n`);

    // Show Bookings
    console.log("🎫 BOOKINGS COLLECTION:");
    const bookings = await Booking.find({}).populate('user', 'name email').populate('parking', 'location');
    if (bookings.length === 0) {
      console.log("No bookings yet");
    } else {
      bookings.forEach((b, index) => {
        console.log(`${index + 1}. ${b.user.name} booked ${b.parking.location}`);
        console.log(`   Time: ${b.startTime} to ${b.endTime}`);
        console.log(`   Status: ${b.status}`);
        console.log(`   ID: ${b._id}\n`);
      });
    }
    console.log(`Total: ${bookings.length} bookings\n`);

    // Show collection stats
    console.log("📈 COLLECTION STATISTICS:");
    console.log("=====================================");
    console.log(`Users: ${users.length}`);
    console.log(`Parking Locations: ${parking.length}`);
    console.log(`Bookings: ${bookings.length}`);
    console.log("=====================================");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

showDatabase();