import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const username = user?.username || "User";

  // Typewriter animation state
  const [typedText, setTypedText] = useState("");

  // GSAP circle refs
  const circle1 = useRef(null);
  const circle2 = useRef(null);
  const circle3 = useRef(null);

  // Form states
  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");

  // File input ref
  const fileInputRef = useRef();

  // Typewriter effect
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

  // GSAP Pulse Scanner Animation
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(circle1.current, {
      scale: 1.6,
      opacity: 0,
      duration: 2,
      ease: "power2.out",
    })
      .to(
        circle2.current,
        {
          scale: 1.6,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
        },
        "-=1.5"
      )
      .to(
        circle3.current,
        {
          scale: 1.6,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
        },
        "-=1.5"
      );
  }, []);

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!resumeFile || !targetRole) {
      alert("Please upload your resume and enter your target role.");
      return;
    }

    navigate("/dashboard"); // Move to dashboard after upload
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white px-6 py-10 flex flex-col items-center text-center">
      {/* Typing "Hello @username!" */}
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {typedText}
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-gray-600 max-w-2xl mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Your AI-powered mentor analyzes your resume, identifies your skill gaps,
        and creates a personalized learning roadmap — fully adapted to your
        pace, strengths, and goals.
      </motion.p>

      {/* Pulse Scanner Animation */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-10">
        <div
          ref={circle1}
          className="absolute w-32 h-32 border-4 border-blue-500 rounded-full opacity-40"
        ></div>

        <div
          ref={circle2}
          className="absolute w-32 h-32 border-4 border-blue-400 rounded-full opacity-40"
        ></div>

        <div
          ref={circle3}
          className="absolute w-32 h-32 border-4 border-blue-300 rounded-full opacity-40"
        ></div>

        <div className="w-10 h-10 bg-blue-600 rounded-full shadow-lg"></div>
      </div>

      {/* Upload Box */}
      <motion.div
        className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 border border-gray-200 text-left"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Get Your AI-Generated Learning Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resume Upload */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-blue-500 transition"
            onClick={() => fileInputRef.current.click()}
          >
            <p className="text-gray-600">
              {resumeFile ? (
                <span className="font-medium text-blue-600">
                  {resumeFile.name}
                </span>
              ) : (
                "Click to upload your resume (PDF)"
              )}
            </p>

            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Target Role Input */}
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Your target role (e.g., Full Stack Developer)"
            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Generate My Learning Plan 🚀
          </button>
        </form>
      </motion.div>
    </div>
  );
}
