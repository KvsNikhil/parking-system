require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

connectDB();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parking", require("./routes/parkingRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Smart Parking API is running 🚀");
});

// SWAGGER
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swaggerDocs");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ERROR HANDLING MIDDLEWARE (must be last)
app.use(errorHandler);

// START SERVER
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);