const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Parking System API",
      version: "1.0.0",
      description: "API documentation for Smart Parking System"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],

    // 🔐 JWT AUTH (VERY IMPORTANT)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    // 🔐 Apply globally
    security: [
      {
        bearerAuth: []
      }
    ],

    // 🏷 Tags (for clean UI)
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Parking", description: "Parking management APIs" },
      { name: "Booking", description: "Booking APIs" },
      { name: "Admin", description: "Admin APIs" }
    ]
  },

  apis: ["./routes/*.js"]
};

module.exports = swaggerJsDoc(options);