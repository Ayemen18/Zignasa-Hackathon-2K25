import { API_URL } from "../config";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  // --- STATE ---
  const [completedTasks, setCompletedTasks] = useState(user?.completedTasks || []);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI Mentor. Ask me anything about your roadmap!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Sync state
  useEffect(() => {
    if (user?.completedTasks) {
        setCompletedTasks(user.completedTasks);
    }
  }, [user]);

  // Auto-scroll Chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  // --- TOGGLE TASK ---
  const toggleTask = async (weekIndex, taskIndex) => {
    const taskId = `w${weekIndex}-t${taskIndex}`;
    const isCurrentlyCompleted = completedTasks.includes(taskId);
    
    // 1. Optimistic Update
    let newCompletedList;
    if (isCurrentlyCompleted) {
        newCompletedList = completedTasks.filter(id => id !== taskId);
    } else {
        newCompletedList = [...completedTasks, taskId];
    }
    setCompletedTasks(newCompletedList);

    // 2. Backend Call (UPDATED PORT TO 8080)
    try {
        const token = localStorage.getItem("token");
        const userId = user._id || user.id;

        if (!userId) {
            console.error("User ID missing!");
            return;
        }

        await axios.put(`${API_URL}/api/auth/update-task`, {
            userId: userId,
            weekIndex,
            taskIndex,
            completed: !isCurrentlyCompleted
        }, { headers: { "x-auth-token": token } });
        
        const updatedUser = { ...user, completedTasks: newCompletedList };
        login(updatedUser, token);

    } catch (err) {
        console.error("Failed to save progress:", err);
        setCompletedTasks(completedTasks); // Revert
        alert("Failed to save progress. Check backend connection.");
    }
  };

  // --- CHAT FUNCTION ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { role: "user", text: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsChatLoading(true);

    // UPDATED PORT TO 8080
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${API_URL}/api/ai/chat`, {
            message: newMessage.text
        }, { headers: { "x-auth-token": token } });

        setChatMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch (err) {
        setChatMessages((prev) => [...prev, { role: "assistant", text: "Error connecting to AI." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  // --- EMPTY STATE ---
  if (!user || !user.roadmap || user.roadmap.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Roadmap Found 🧐</h2>
        <Link to="/home" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Create My Plan
        </Link>
      </div>
    );
  }

  // Progress Calculation
  const totalTasks = user.roadmap.reduce((acc, week) => acc + (week.tasks?.length || 0), 0);
  const completedCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 md:p-12 pb-24">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome, <span className="text-blue-600 capitalize">{user.username}</span>!
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Target Role: <b>{user.targetRole || "Developer"}</b></p>
          </div>
          
          <div className="w-full md:w-72 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span className="text-blue-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
          </div>
        </header>

        {/* --- GAP ANALYSIS --- */}
        {user.analysis ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Level</h3>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold">
                  {user.analysis.current_level || "Assessing..."}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Skill Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {user.analysis.missing_skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-md text-sm font-semibold">
                      {skill}
                    </span>
                  )) || <span>No specific gaps found.</span>}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
            <div className="bg-yellow-50 p-4 rounded mb-8 text-yellow-800 border border-yellow-200">
               ⚠️ Analysis missing. Please generate a new plan.
            </div>
        )}

        {/* --- ROADMAP (COMPACT MODE) --- */}
        <div className="space-y-8 pb-20"> {/* Reduced from space-y-24 */}
          {user.roadmap.map((week, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // COMPACT CARD: No min-height, normal padding
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-500"></div>
              
              <div className="mb-6 border-b border-gray-100 pb-4">
                <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest mb-2">
                    Week 0{week.week}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {week.title}
                </h3>
                <p className="text-gray-600 mt-2 text-base leading-relaxed">
                    {week.description}
                </p>
              </div>

              {/* TASKS */}
              <div className="space-y-3 mb-6">
                {week.tasks?.map((task, tIndex) => {
                    const taskId = `w${week.week}-t${tIndex}`;
                    const isChecked = completedTasks.includes(taskId);
                    return (
                        <div 
                            key={taskId} 
                            onClick={() => toggleTask(week.week, tIndex)}
                            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                isChecked 
                                ? "bg-green-50 border-green-300" 
                                : "bg-gray-50 border-transparent hover:bg-white hover:border-blue-200 hover:shadow-sm"
                            }`}
                        >
                            <div className={`mt-0.5 min-w-[20px] h-5 rounded border flex items-center justify-center transition-colors ${
                                isChecked 
                                ? "bg-green-500 border-green-500" 
                                : "bg-white border-gray-400"
                            }`}>
                                {isChecked && <span className="text-white font-bold text-xs">✓</span>}
                            </div>
                            <span className={`text-base ${isChecked ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {task}
                            </span>
                        </div>
                    )
                })}
              </div>

              {/* RESOURCES */}
               {week.resources && week.resources.length > 0 && (
                 <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase self-center mr-2">Study:</span>
                    {week.resources.map((res, rIndex) => (
                        <a key={rIndex} href={`https://www.google.com/search?q=${res}`} target="_blank" rel="noreferrer" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white transition">
                            📖 {res}
                        </a>
                    ))}
                 </div>
               )}

            </motion.div>
          ))}
        </div>
      </div>

      {/* --- FLOATING CHATBOT --- */}
      <AnimatePresence>
        {isChatOpen && (
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
            >
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <span className="font-bold text-lg">🤖 AI Mentor</span>
                    <button onClick={() => setIsChatOpen(false)} className="hover:bg-blue-700 p-1 rounded">✕</button>
                </div>
                <div ref={chatScrollRef} className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatLoading && <div className="text-xs text-gray-400 animate-pulse">AI is typing...</div>}
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex gap-2">
                    <input 
                        className="flex-1 px-4 py-2 border rounded-full text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" disabled={isChatLoading} className="bg-blue-600 text-white w-10 h-10 rounded-full hover:bg-blue-700 flex items-center justify-center shadow-md">➤</button>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 text-3xl transition-transform hover:scale-110"
      >
        {isChatOpen ? "✕" : "💬"}
      </button>

    </div>
  );
}