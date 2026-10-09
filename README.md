# Suraksha: Disaster Preparedness & Community Response Platform

Suraksha is a comprehensive full-stack platform designed to enhance community resilience during natural disasters (floods, landslides, earthquakes). It provides interactive preparedness education, gamified micro-challenges, a real-time SOS & incident reporting system, and volunteer task coordination.

## 🌟 Key Features

### 1. Community Mobilization & SOS Response (Mebil's Module)
* **Real-time SOS Dashboard:** Track active help requests with intelligent priority scoring (Base Urgency + Age Bonus + Request Type weight).
* **Volunteer Assignment System:** Empower coordinators to seamlessly assign available volunteers to ongoing crisis requests.
* **Status Updates:** "I am okay" resolution and "Still in danger!" escalation mechanisms for active victims.
* **Explainable Priority Tooltips:** Transparent scoring helps coordinators understand *why* an alert is ranked critical.

### 2. Gamified Preparedness & Awareness
* **Safety Tips & Micro-Challenges:** Users earn points and badges by completing bite-sized disaster readiness tasks.
* **Interactive Awareness Animations:** Immersive HTML5 Canvas simulations to visually communicate disaster risks. 
  * Integrates continuous looping animations for *Clogged Drain Flooding*, *Lake Overflow Flooding*, and *Deforestation Landslides*.
* **Audio Accessibility:** Integrated Text-to-Speech (TTS) using native, natural-sounding browser voices to read safety guidelines and quiz questions.

### 3. Modern UI & Mobile Support (PWA)
* **Progressive Web App (PWA):** Fully installable on Android and iOS devices, capable of running securely over local networks or HTTPS.
* **Monochrome Aesthetic:** A highly-contrasted, sleek black-and-white global styling for UI elements, preserving color only for focal interactive elements (like custom cursor water drops and disaster animations).
* **Automated Session Management:** Graceful token expiry handling with auto-redirects upon 401 Unauthorized errors.

### 4. Localization
* **Bilingual Support:** Full English (EN) and Hindi (HI) interface toggling.

---

## 🛠 Tech Stack

* **Frontend:** React, TypeScript, Vite, React Router
* **Backend:** FastAPI, Python, Uvicorn, SQLite (Designed for PostGIS integration)
* **Styling:** Custom CSS with dark mode UI/UX, Glassmorphism, and responsive design layouts.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (3.9+)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host
   ```
   *The frontend will be available at `http://localhost:5173`.*

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv .venv
   # Windows
   .venv\\Scripts\\activate
   # macOS/Linux
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *The backend will be available at `http://localhost:8000`. API docs can be found at `http://localhost:8000/docs`.*

---

## 🤝 Project Modules & Contribution
This repository houses the consolidated architecture. It integrates:
1. **Aryan:** Platform Architecture & Backend Integration
2. **Nishchay:** Field Data Collection & Exposure Mapping
3. **Shahal:** GIS, Hazard & Risk Intelligence
4. **Anuraj:** Intelligent Analytics & ML/CV
5. **Rishi:** Emergency Alerts & Incident Reporting
6. **Mebil:** Community Mobilization, Preparedness & Recovery *(Current primary focus of this commit)*

---

*Stay Safe. Stay Prepared.*
