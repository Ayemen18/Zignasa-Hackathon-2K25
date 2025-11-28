import React, { useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  
  // Local state for checkboxes (doesn't save to DB yet, good for demo)
  const [checkedTasks, setCheckedTasks] = useState({});

  const toggleTask = (id) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Empty State (If user goes here without uploading)
  if (!user || !user.roadmap || user.roadmap.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <span className="text-6xl mb-4 block">🧐</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">No Roadmap Found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
            It looks like you haven't generated a plan yet. Upload your resume to let the AI build your path.
            </p>
            <Link to="/home" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
            Create My Plan
            </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome, <span className="text-blue-600 capitalize">{user.username}</span>!
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Target Role: <span className="font-semibold text-gray-800">{user.targetRole}</span>
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-400 font-mono">AI MODEL: GPT-4o-Mini</p>
            <p className="text-sm text-gray-400 font-mono">STATUS: ACTIVE</p>
          </div>
        </header>

        {/* --- SECTION 1: GAP ANALYSIS CARD --- */}
        {user.analysis && (
          <motion.div 
            // <--- SCROLL ANIMATION CHANGE: Use whileInView instead of animate
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% visible
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
            <div className="flex flex-col md:flex-row gap-10">
              
              {/* Current Level */}
              <div className="min-w-[150px]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Level</h3>
                <span className="inline-block px-4 py-2 rounded-lg bg-green-100 text-green-800 font-bold text-lg border border-green-200">
                  {user.analysis.current_level || "Assessing..."}
                </span>
              </div>
              
              {/* Missing Skills */}
              <div className="flex-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  ⚠️ Critical Skill Gaps Identified
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user.analysis.missing_skills?.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-semibold shadow-sm">
                      {skill}
                    </span>
                  )) || <span className="text-gray-400 italic">No major gaps found!</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- SECTION 2: THE ROADMAP --- */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <span className="bg-blue-100 p-2 rounded-lg text-blue-600">🗺️</span> Your Personalized Path
        </h2>
        
        <div className="relative border-l-4 border-gray-200 ml-4 md:ml-6 space-y-16 pb-10">
          {user.roadmap.map((week, index) => (
            <motion.div
              key={index}
              // <--- SCROLL ANIMATION CHANGE: More dynamic entrance from side/bottom
              initial={{ opacity: 0, x: -50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }} // Trigger when 20% is in viewport
              transition={{ 
                duration: 0.6, 
                type: "spring", 
                bounce: 0.3, 
                delay: index * 0.1 // Keep a slight stagger effect
              }}
              className="relative pl-8 md:pl-16"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[14px] top-6 bg-white h-6 w-6 rounded-full border-4 border-blue-500 shadow-md z-10"></div>
              
              {/* Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                
                {/* Week Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                      Week 0{week.week}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-2">{week.title}</h3>
                  </div>
                </div>

                {/* Week Content */}
                <div className="p-6 md:p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">{week.description}</p>

                  {/* Tasks Checklist */}
                  <div className="space-y-3 mb-8">
                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2">Action Plan</h4>
                    {week.tasks && week.tasks.map((task, taskIndex) => {
                        const uniqueId = `w${week.week}-t${taskIndex}`;
                        const isChecked = checkedTasks[uniqueId];
                        return (
                            <div 
                              key={uniqueId} 
                              className={`flex items-start gap-4 p-3 rounded-xl transition-all cursor-pointer border ${
                                isChecked ? "bg-green-50 border-green-200" : "bg-white border-transparent hover:bg-gray-50"
                              }`}
                              onClick={() => toggleTask(uniqueId)}
                            >
                                <div className={`mt-1 min-w-[24px] h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                    isChecked ? "bg-green-500 border-green-500" : "border-gray-300"
                                }`}>
                                    {isChecked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`text-base ${isChecked ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}>
                                    {task}
                                </span>
                            </div>
                        )
                    })}
                  </div>

                  {/* Resources */}
                  {week.resources && week.resources.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                        {week.resources.map((res, rIndex) => (
                            <a 
                                key={rIndex} 
                                href={`https://www.google.com/search?q=${res} tutorial`} // Smart link to Google
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 text-xs px-3 py-1.5 rounded-full transition-colors"
                            >
                                🔗 {res}
                            </a>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Chat Button (X-Factor) */}
      <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-500 hover:scale-110 transition-all z-50 group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute right-full mr-4 top-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Ask Mentor
        </span>
      </button>

    </div>
  );
}