const mongoose = require('mongoose');

// 1. Updated Roadmap Schema (Added 'tasks')
const RoadmapItemSchema = new mongoose.Schema({
  week: Number,
  title: String,
  description: String,
  tasks: [String],       // <--- NEW: Stores the specific checklist items
  resources: [String],
  completed: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  resumeText: { type: String },
  targetRole: { type: String },

  // 2. NEW: Analysis Section (Stores the "Gap Analysis")
  analysis: {
    current_level: String,      // e.g., "Intermediate"
    missing_skills: [String]    // e.g., ["Docker", "GraphQL"]
  },

  roadmap: [RoadmapItemSchema], 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);