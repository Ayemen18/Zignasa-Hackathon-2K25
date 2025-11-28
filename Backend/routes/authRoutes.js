const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // 2. Create User
    user = new User({ username, email, password });

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // 4. Return Token AND User Data (The Change)
    const payload = { user: { id: user.id } };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roadmap: [] // New users have empty roadmap
        }
      });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check User
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    // 3. Return Token AND User Data
    const payload = { user: { id: user.id } };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          targetRole: user.targetRole, // Load previous data if it exists
          roadmap: user.roadmap,
          analysis: user.analysis 
        }
      });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/auth/update-task
// @desc    Mark a task as completed/pending
router.put('/update-task', async (req, res) => {
  const { userId, weekIndex, taskIndex, completed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update the specific task's status
    // Note: This assumes you added 'completed' array or logic to your Schema.
    // For Hackathon speed, we will use a simple "progress tracking" array in the user object
    // If your schema is strict, we might just store a list of "completedTaskIds" strings.
    
    if (!user.completedTasks) user.completedTasks = [];
    
    const taskId = `w${weekIndex}-t${taskIndex}`;
    
    if (completed) {
      // Add if not exists
      if (!user.completedTasks.includes(taskId)) user.completedTasks.push(taskId);
    } else {
      // Remove if exists
      user.completedTasks = user.completedTasks.filter(id => id !== taskId);
    }

    await user.save();
    res.json(user.completedTasks); // Return updated list

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;

