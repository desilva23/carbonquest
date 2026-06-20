# CarbonQuest 🌍

CarbonQuest is an interactive, gamified web application designed to track individual environmental impact and offer actionable, personalized insights to help users reduce their daily carbon footprints.

---

## 📌 Project Overview & Vertical

* **Vertical Chosen:** Carbon Footprint Awareness & AI Coaching
* **Target Audience:** Individuals seeking to build sustainable daily habits through personalized, context-aware coaching and gamified environmental feedback.
* **Core Philosophy:** Environmental metrics are often abstract. CarbonQuest bridges the gap by translating carbon numbers (kg CO₂) into tangible everyday analogies and illustrating the user's impact in real-time through an interactive visual ecosystem.

---

## ⚙️ How the Solution Works & Key Features

1. **User Onboarding Quiz:** 
   * A 4-step wizard capturing user baseline demographics: name, daily commute mode, primary diet type, and household energy source.
2. **Interactive EcoWorld Canvas:** 
   * A live-rendered SVG/CSS landscape that serves as a direct reflection of the user's daily habits. 
   * **Healthy Score (70+):** Sunny sky, lush green grass, flying birds, and growing trees.
   * **Hazy Score (40-69):** Sunset colors, faded ground, and minimal foliage.
   * **Industrial Score (<40):** Thick grey smog layer and barren trees.
3. **Smart Carbon Logging & Calculator:** 
   * Real-time calculation of daily greenhouse gas emissions across 5 categories: Transport, Food & Diet, Energy, Shopping, and Lifestyle.
   * Employs validated emission factors (sourced from EPA and DEFRA 2023).
   * Automatically displays relatable metaphors (e.g. "about 1.2x charging your phone 12 times").
4. **Gamified Missions & Achievements:** 
   * **Daily & Weekly Tasks:** Logging specific eco-actions (like commuting car-free, buying local food, or unplugging devices) completes challenges to award Experience Points (XP).
   * **Badges:** 24+ unique achievements categorized by rarity (Common, Uncommon, Rare, Epic, Legendary).
   * **Levels:** Progress from "Seedling" (Level 1) to "Eco Legend" (Level 15).
5. **AI Carbon Coach ("Eco"):** 
   * A chat assistant powered by Groq's Llama-3 model that acts as a personalized coach. It reviews the user's profile context (streak, today's emission levels, energy source, etc.) to deliver tailored daily tips.

---

## 🛠️ Architecture, Approach & Logic

* **Tech Stack:** Built with **Next.js (App Router)**, **TypeScript**, **Lucide React** (icons), and **TailwindCSS** / **Vanilla CSS** styles for rich, premium transitions.
* **State Management:** Fully client-side state machine using a custom hook (`useStore`) backed by `localStorage` persistence. This ensures the app is blazing fast, private, and works offline.
* **AI Engine:**
  * Connects to Groq Cloud's `llama-3.3-70b-versatile` endpoint.
  * Injects current user profiling details (streak, logged carbon, energy type, etc.) as prompt context to prevent generic AI responses.
  * Implements seamless fallback responses if the network goes offline or the Groq API key is missing.

---

## 📝 Assumptions Made

1. **Local Offline-First Storage:** Data is stored locally in the browser's `localStorage` to maximize privacy and avoid complex user database setups.
2. **Emission Factors:** Averages for transport, food, and energy are modeled on combined guidelines from international bodies (EPA, DEFRA, and Our World in Data) to maintain a balance between accuracy and simplified entry.
3. **EcoScore Mapping:** The daily score evaluates a user's emissions against global daily averages (~13.1 kg CO₂). Emitting twice the global average yields an EcoScore of 0, while zero emissions yields a score of 100.

---

## 🚀 Getting Started & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Installation
1. Navigate to the project directory:
   ```bash
   cd carbonquest
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 How to Get a Groq Cloud API Key

To enable real-time AI Coaching with Llama 3:

1. Go to the [Groq Console](https://console.groq.com/).
2. Create a free account or sign in.
3. In the left sidebar, navigate to **API Keys**.
4. Click on **Create API Key**.
5. Give your key a name (e.g., `CarbonQuest-Coach`) and click **Generate**.
6. Copy the generated key immediately (it will only be shown once).
7. Paste this key into your `.env.local` file under `GROQ_API_KEY`.
