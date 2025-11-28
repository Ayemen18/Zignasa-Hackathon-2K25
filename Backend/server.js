require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Allow JSON body parsing
app.use(cors()); // Allow Frontend to hit Backend

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/airoute"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
