const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const OpenAI = require("openai");
const auth = require("../middleware/auth"); // Import middleware
const User = require("../models/user");

const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Prompt Engineering
const SYSTEM_PROMPT = `
You are a Career Mentor. Analyze the resume and target role.
Return JSON ONLY.
Structure:
{
  "roadmap": [
    { "week": 1, "title": "Topic", "description": "Details", "resources": ["url"] }
  ]
}
`;

// @route   POST /api/ai/generate
// @desc    Upload PDF -> Parse -> AI -> Save to DB
// @access  Private (Needs Token)
router.post("/generate", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    // 1. Parse PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // 2. Call AI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Resume: ${resumeText}\nTarget Role: ${req.body.role}`,
        },
      ],
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    // 3. Update User in DB
    // We use req.user.id (from the auth middleware) to find the correct user
    const user = await User.findById(req.user.id);
    user.resumeText = resumeText;
    user.targetRole = req.body.role;
    user.roadmap = aiResponse.roadmap;
    await user.save();

    // 4. Cleanup
    fs.unlinkSync(req.file.path);

    // 5. Send data back to frontend
    res.json(user.roadmap);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/ai/roadmap
// @desc    Get the saved roadmap (for when user refreshes page)
router.get("/roadmap", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user.roadmap);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
