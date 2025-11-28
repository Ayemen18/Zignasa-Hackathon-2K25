const mongoose = require("mongoose");

// Schema for the Roadmap items (Embedded inside User)
const RoadmapItemSchema = new mongoose.Schema({
  week: Number,
  title: String,
  description: String,
  resources: [String],
  completed: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  resumeText: { type: String }, // Context for chatbot
  targetRole: { type: String },
  roadmap: [RoadmapItemSchema], // Array of roadmap items
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
