const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-extraction'); // Using the robust library
const OpenAI = require('openai');
const auth = require('../middleware/auth'); // Protects the route
const User = require('../models/User');

// Configure Multer (Temp storage for uploads)
const upload = multer({ dest: 'uploads/' });

// Configure OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// THE "SENIOR MENTOR" SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are an expert Senior Technical Career Coach.
Your task is to analyze a candidate's RESUME text against a TARGET ROLE and generate a personalized study plan.

### INSTRUCTIONS:
1. **Gap Analysis:** Compare the resume skills vs. the target role requirements. Focus the roadmap ONLY on filling these gaps.
2. **Actionable Tasks:** Do not just say "Learn React". Say "Build a Todo App using React Hooks".
3. **Structure:** Create a 4-week intensive roadmap.
4. **Strict JSON:** Output ONLY valid JSON. Do not use Markdown code blocks.

### JSON FORMAT:
{
  "analysis": {
    "current_level": "Beginner/Intermediate/Advanced",
    "missing_skills": ["Skill A", "Skill B"]
  },
  "roadmap": [
    {
      "week": 1,
      "title": "High-level focus for the week",
      "description": "Why this is important.",
      "tasks": ["Specific task 1", "Specific task 2", "Project to build"],
      "resources": ["Topic keyword 1", "Topic keyword 2"]
    }
  ]
}
`;

// @route   POST /api/ai/generate
// @desc    Upload PDF -> Parse -> AI Analysis -> Save to DB
// @access  Private (Requires Token)
router.post('/generate', auth, upload.single('resume'), async (req, res) => {
  try {
    // 1. Validation
    if (!req.file) return res.status(400).send("No file uploaded");
    if (!req.body.role) return res.status(400).send("Target role is required");

    // 2. Extract Text from PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // 3. Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // Optimized for JSON
      response_format: { type: "json_object" }, // FORCE Valid JSON
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Resume: ${resumeText}\nTarget Role: ${req.body.role}` }
      ],
    });

    // 4. Parse AI Response
    const aiContent = completion.choices[0].message.content;
    let aiResponse;
    try {
        aiResponse = JSON.parse(aiContent);
    } catch (parseError) {
        return res.status(500).json({ error: "AI failed to generate valid JSON. Try again." });
    }

    // 5. Save to Database
    // We use req.user.id which comes from the auth middleware
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.resumeText = resumeText;
    user.targetRole = req.body.role;
    user.roadmap = aiResponse.roadmap;
    user.analysis = aiResponse.analysis; // Saving the gap analysis
    
    await user.save();

    // 6. Cleanup & Respond
    fs.unlinkSync(req.file.path); // Delete temp file
    res.json(user); // Send back the updated user object

  } catch (error) {
    console.error("Server Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); // Cleanup on error
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/ai/roadmap
// @desc    Get the saved roadmap (for dashboard refresh)
router.get('/roadmap', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/ai/chat
// @desc    Chat with the Mentor (Context Aware)
router.post('/chat', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const user = await User.findById(req.user.id);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `You are a mentor. The user is a ${user.analysis?.current_level || 'student'}. 
                    They are missing these skills: ${user.analysis?.missing_skills?.join(', ') || 'unknown'}. 
                    Target Role: ${user.targetRole}. 
                    Keep answers short and motivating.` 
                },
                { role: "user", content: message }
            ]
        });

        res.json({ reply: completion.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;