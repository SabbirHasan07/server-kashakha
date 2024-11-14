// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors

const app = express();

// Enable CORS for requests from localhost:3000
app.use(cors({
    origin: "http://localhost:3000",  // Allow requests from localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// Import routes
const donationRoutes = require("./routes/donationRoutes");
const userRoutes = require("./routes/userRoutes")


// Connect to MongoDB without deprecated options
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.error("MongoDB connection failed:", error));

// Use routes
app.use("/api/donations", donationRoutes);
app.use("/api/users", userRoutes);  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Handle preflight request (OPTIONS) for CORS
app.options("*", cors());
