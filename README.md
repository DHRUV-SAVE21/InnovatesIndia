<div align="center">

# 🌾 Annadata Saathi (Let Go 3.0) 🚜

**An Advanced Multi-Agent Precision Agriculture & Farm Intelligence System**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)](https://www.tensorflow.org/)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A powerful Web Application powered by AI, Machine Learning, Deep Reinforcement Learning (DRL), and IoT to revolutionize farming practices, enhance crop yields, and ensure agricultural safety.

---

</div>

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Stellar Features](#-stellar-features)
- [Disruptive Hardware Economics](#-disruptive-hardware-economics)
- [Technology Stack](#-technology-stack)
- [Intelligent Architecture](#-intelligent-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🌟 About the Project

**Annadata Saathi** is designed to be a farmer's ultimate digital companion. By combining a highly responsive React frontend with a robust Python FastAPI backend, it delivers real-time intelligence directly to the hands of farmers. 

Whether it's using deep learning to recommend the perfect crop, computer vision to diagnose a tractor engine, or IoT sensors to monitor warehouse safety, this platform bridges the gap between traditional agriculture and cutting-edge technology. Focusing heavily on the Indian farmer, our platform natively integrates localized intelligence and vernacular support to ensure maximum accessibility.

---

## 🚀 Stellar Features

### 👩🌾 1. AI-Powered Farmer Companion (Feature 4)
- **Contextual AI Agent**: Personalized conversational AI that understands the farmer's unique profile, land size, and history.
- **Sarvam AI Integration (India AI)**: Utilizes Sarvam AI models for superior Indic language processing, ensuring farmers can interact with the app in their native language with robust fallbacks and high contextual accuracy.
- **DRL Crop Recommendation**: Utilizes Deep Reinforcement Learning to analyze environmental variables and recommend the most profitable and sustainable crops.

### 🩺 2. Instant Crop Health Diagnostics (Feature 2)
- **Computer Vision Analysis**: Snap a picture of a diseased leaf and our pre-loaded **TensorFlow modules** instantly identify the pathogen.
- **Actionable Remediation**: Get precise organic and chemical treatment suggestions immediately directly in the farmer's native dialect.

### 🚜 3. Smart Equipment Analyzer (Feature 5)
- **Equipment Health Scoring**: Upload images of farming machinery to receive a detailed health score (0-100).
- **Proactive Maintenance**: AI generates dynamic 6-month maintenance schedules predicting potential failures before they happen.
- **Subsidy & Cost Estimator**: Identifies damaged parts, estimates repair costs, compares marketplace prices, and calculates eligible state/federal agricultural subsidies.

### 🔥 4. IoT Warehouse Safety (Feature 7)
- **Real-Time Monitoring**: Integrates with hardware sensors monitoring temperature, gas leaks, and fire hazards.
- **Instant Alerts**: Background threads poll sensor data every 5 seconds, instantly pushing alerts to the dashboard to prevent storage disasters.

### 🔗 5. Secure Ecosystem (Feature 6 & Auth)
- **Facial Recognition Login**: Frictionless and highly secure authentication tailored for ease of use in the field without complex passwords.
- **Blockchain Inventory**: Transparent, immutable tracking of supply chains to prevent fraud and ensure product trace-ability.
- **Live Market Data**: Real-time Mandi (market) prices and localized weather/disaster news feeds.

### 🏛️ 6. Government Admin Dashboard
- **Real-Time Scheme Management**: A powerful, dedicated interface tailored specifically for government officials and administrators.
- **Approval Workflows**: Admins can instantly approve, reject, or oversee farmer scheme applications directly from the dashboard, ensuring rapid and transparent distribution of subsidies to the farmers who need them.

---

## 💸 Disruptive Hardware Economics

A core mission of Annadata Saathi is making cutting-edge precision agriculture completely accessible to the average Indian farmer. Current market alternatives for agricultural IoT setups typically cost upwards of **₹3,000+** ([Example Market Product](https://share.google/JVOmC8kNvnr8ryzx3)). 

Our custom IoT architecture shatters this barrier:
- **Field Data Node (Soil Moisture, Temperature, NPK Proxy)**: Engineered and deployed using ultra-low-cost microcontrollers and sensors for just **₹500**.
- **Warehouse Protection Node (Fire & Gas Sensors)**: Complete safety telemetry built for only **₹500**.
- **Scalable B2G Business Model**: The comprehensive hardware setup can be provided to farmers at a heavily subsidized price (up to **₹1,500** max), making it an extremely viable **Business-to-Government** solution for widespread rural distribution alongside the administrative dashboard.

---

## 💻 Technology Stack

<details>
<summary><strong>Frontend Architecture</strong></summary>

- **Core**: React.js 18 + Vite
- **Architecture**: Web Application capable of offline caching and edge deployments.
- **Styling**: Tailwind CSS & Modern Glassmorphism UI components.
- **Key Modules**: Real-time charts, Map integrations (Zone maps), CameraCapture arrays.

</details>

<details>
<summary><strong>Backend Architecture</strong></summary>

- **Core API**: FastAPI (Python 3.10+)
- **Database**: Supabase / PostgreSQL (Secure Row Level Security implemented based on `user_id`).
- **Machine Learning & AI**: 
  - TensorFlow (Disease Classification Models)
  - PyTorch (Deep Reinforcement Learning Agents)
  - **Sarvam AI** (Indic Language Models & Speech)
- **Real-Time Services**: Threading modules for non-blocking ML loading and infinite-loop hardware polling.

</details>

---

## 🧠 Intelligent Architecture

The system operates on a heavily decoupled API-first methodology. To prioritize speed, the backend utilizes `startup` event hooks in FastAPI to preload massive Neural Networks into memory via background threads. This prevents the dreaded "server timeout" on the first user request. 

Data flows seamlessly from the React Web App (sending Base64 images and JWTs) directly to modularized backend "Features" (`feature1` through `feature7`), ensuring a highly scalable and maintainable codebase.

---

## ⚙️ Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Supabase Account / Database credentials

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Configure your environment
cp .env.example .env
# Edit .env and supply your Supabase, Sarvam API, and other credentials

# Ignite the FastAPI Server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install necessary Node modules
npm install

# Start the Vite development environment
npm run dev
```

The application should now be accessible at `http://localhost:5173`, with the backend running on `http://localhost:8000`.

---

## 📁 Project Structure

```text
Let_Go_3.0/
├── backend/                  # Python FastAPI Server
│   ├── main.py               # Application Entry Point & Orchestrator
│   ├── auth/                 # Standard JWT Authentication
│   ├── face_auth/            # Facial Recognition Service
│   ├── feature2/             # Crop Disease Prediction ML
│   ├── feature4/             # Farmer AI Profile Agent (w/ Sarvam AI)
│   ├── feature4_drl/         # DRL Crop Recommend Engine
│   ├── feature5/             # Equipment Analyzer & Subsidies
│   ├── feature6_blockchain/  # Immutable Supply Chain Tracker
│   ├── feature7/             # IoT Safety Monitor
│   └── hardware/             # Physical Sensor Integrations
│
└── frontend/                 # React Web App
    ├── src/
    │   ├── api/              # Axios handlers connecting to FastAPI
    │   ├── components/       # Reusable UI modules (Charts, Cards, Camera)
    │   ├── pages/            # Application Routing Views
    │   └── App.jsx           # Core Router and Theme Provider
    ├── vite.config.js
    └── tailwind.config.js
```

---

<div align="center">

*Engineered with precision for the future of farming.* 🌾

</div>
