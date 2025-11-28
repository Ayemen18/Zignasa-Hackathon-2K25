const mongoose = require('mongoose');

const RoadmapItemSchema = new mongoose.Schema({
  week: Number,
  title: String,
  description: String,
  tasks: [String],
  resources: [String],
  completed: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  resumeText: { type: String },
  targetRole: { type: String },

  // --- THE FIX: Use 'Mixed' to accept ANY structure ---
  analysis: { type: mongoose.Schema.Types.Mixed }, 

  roadmap: [RoadmapItemSchema],
  completedTasks: { type: [String], default: [] },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);