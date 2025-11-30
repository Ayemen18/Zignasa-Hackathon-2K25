# 🧠 AI-Based Personalized Learning System

Resume-Driven Skill Gap Analysis & Adaptive Learning Roadmap Generator

An AI-powered platform that analyzes a user’s resume, identifies missing skills, and generates a personalized, adaptive learning plan tailored to the user’s target role.  
The system features an interactive dashboard, animated weekly roadmap cards, progress tracking, and a resume-aware AI chatbot mentor to guide learners throughout their journey.

---

## 🚀 Features

### 🔍 1. AI Resume Parsing

Automatically extracts text, skills, strengths, and patterns from uploaded PDF resumes.

### 🎯 2. Skill Gap Detection

Compares the user’s resume with the selected target role to identify missing or weak skills.

### 🗺️ 3. Personalized Learning Roadmap

Generates a week-wise structured study plan including tasks, resources, and learning goals.

### ⚡ 4. Adaptive Learning System

The roadmap dynamically updates based on the user's progress and learning speed.

### 💬 5. Resume-Aware AI Chatbot

Ask customized questions, clarify doubts, or get guided explanations based on your background.

### 📊 6. Dashboard with Progress Tracking

Beautiful UI to track weekly completion, view skill analysis, and revisit your learning roadmap.

---

## 🛠️ Tech Stack

### **Frontend**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=zustand&logoColor=white)

---

### **Backend**

![Node.js](https://img.shields.io/badge/Node.js-3C873A?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6B6B?style=for-the-badge&logoColor=white)
![pdf-parse](https://img.shields.io/badge/PDF%20Parse-A81D33?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)

---

### **Database**

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

---

### **Other Tools**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05033?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

---

## 🔁 How It Works

1. User uploads a PDF resume and enters a target job role
2. Backend extracts resume text and sends a structured AI prompt to OpenAI
3. AI identifies skill gaps & generates a 4-week personalized roadmap
4. Frontend displays animated roadmap cards + a clean dashboard
5. User interacts with the AI chatbot for learning guidance
6. Roadmap adapts as the user checks off weekly tasks

---

## 📂 Project Structure

```
/frontend
    /src
        /components
        /pages
        /hooks
        /store
        App.jsx
        main.jsx

/backend
    /routes
    /controllers
    /models
    server.js
```

---

## 🖼️ Screenshots

| Signup Page                | Home Page              | Dashboard Page                   | Chatbot Page                 |
| -------------------------- | ---------------------- | -------------------------------- | ---------------------------- |
| ![Signup Page](Signup.png) | ![Home Page](Home.png) | ![Dashboard Page](Dashboard.png) | ![Chatbot Page](Chatbot.png) |

---

<h2 align="left">🔗 Live Demo</h2>

<p align="left">
  <a href="https://learn-ai-hackathon.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/OPEN-LIVE%20DEMO-blue?style=for-the-badge" />
  </a>
</p>

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**

```sh
git clone https://github.com/Srujan1613/Zignasa-Hackathon
cd Zignasa-Hackathon
```

### **2. Frontend Setup**

```sh
cd frontend
npm install
npm run dev
```

### **3. Backend Setup**

```sh
cd backend
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file inside `/backend`:

```
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

## 🌟 Why This Project Stands Out

- Fully personalized learning (not generic content)
- Resume-aware AI reasoning
- Dynamic, adaptive weekly roadmap generation
- Beautiful UI with animations
- Scalable for EdTech, HR, hiring, and corporate training

---

## 📈 Future Enhancements

- Chatbot with long-term memory
- Gamification (levels, badges, streaks)
- Mobile app version
- Analytics dashboard for real-time user progress

---

## 🤝 Contributors

| Name                      | Role                              |
| ------------------------- | --------------------------------- |
| Shaik Abdul Kareem Ayemen | Backend Developer                 |
| Kamble Navyasri           | Frontend Developer                |
| K.Srujan                  | Testing, Git control & Deployment |

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## ⭐ Support

If you found this project useful, consider giving it a **star ⭐ on GitHub** —  
it encourages us and helps others discover it!
