import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();

  // ✅ CORRECT SELECTORS (Prevents Infinite Loop)
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const username = user?.username || "User";
  const [typedText, setTypedText] = useState("");
  
  // Animation Refs
  const circle1 = useRef(null);
  const circle2 = useRef(null);
  const circle3 = useRef(null);

  // Form State
  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Typewriter Effect
  useEffect(() => {
    let i = 0;
    const text = `Hello @${username}!`;
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [username]);

  // Pulse Animation
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(circle1.current, { scale: 1.6, opacity: 0, duration: 2, ease: "power2.out" })
      .to(circle2.current, { scale: 1.6, opacity: 0, duration: 2, ease: "power2.out" }, "-=1.5")
      .to(circle3.current, { scale: 1.6, opacity: 0, duration: 2, ease: "power2.out" }, "-=1.5");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !targetRole) {
      alert("Please upload your resume and enter your target role.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("role", targetRole);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // 1. Call AI
      const res = await axios.post("http://localhost:8080/api/ai/generate", formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      // 2. Update Store with new Roadmap
      login(res.data, token);

      // 3. Navigate to Dashboard
      console.log("Plan Generated!", res.data);
      navigate("/dashboard");

    } catch (err) {
      console.error("AI Error:", err);
      alert("Error generating plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-6 py-10 flex flex-col items-center text-center">
      <motion.h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {typedText}
      </motion.h1>

      <motion.p className="text-gray-600 max-w-2xl mb-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        Your AI-powered mentor analyzes your resume, identifies your skill gaps, and creates a personalized learning roadmap.
      </motion.p>

      {/* Pulse Scanner */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-10">
        <div ref={circle1} className="absolute w-32 h-32 border-4 border-blue-500 rounded-full opacity-40"></div>
        <div ref={circle2} className="absolute w-32 h-32 border-4 border-blue-400 rounded-full opacity-40"></div>
        <div ref={circle3} className="absolute w-32 h-32 border-4 border-blue-300 rounded-full opacity-40"></div>
        <div className="w-12 h-12 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white z-10">
          {loading ? (
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          ) : (
            <span className="text-2xl">🚀</span>
          )}
        </div>
      </div>

      {/* Upload Form */}
      <motion.div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-left" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Your Roadmap</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition flex flex-col items-center justify-center text-center gap-2 ${resumeFile ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}
            onClick={() => fileInputRef.current.click()}
          >
            <input type="file" accept="application/pdf" ref={fileInputRef} onChange={(e) => setResumeFile(e.target.files[0])} className="hidden" />
            {resumeFile ? (
              <><span className="text-3xl">📄</span><span className="font-semibold text-green-700">{resumeFile.name}</span></>
            ) : (
              <><span className="text-3xl text-gray-400">☁️</span><span className="font-medium text-gray-600">Click to upload Resume (PDF)</span></>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Role</label>
            <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Full Stack Developer" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" disabled={loading} />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-3.5 text-white font-bold rounded-lg shadow-md transition ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? "Analyzing Profile... (~15s)" : "Generate Plan ✨"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}