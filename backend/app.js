const express = require("express");
const connectDB = require("./config/db");
const mainRouter = require("./routes/index");
const cors = require("cors");
const app = express();

// Connect to Database
connectDB();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use the API router for all routes starting with /api/v1
app.use("/api/v1", mainRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
