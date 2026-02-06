# Project Atlas | AI Project Architect

Project Atlas is a high-fidelity, AI-powered web application designed to help engineering students bridge the gap between academic theory and practical execution. Using the **Gemini 3 API**, it generates custom, strategic roadmaps tailored to a student's branch, year, and specific interests.

## 🚀 Features

- **Intelligence-Driven Ideation**: Suggests 4 trending, high-impact project ideas using real-time search grounding.
- **Dynamic Roadmaps**: Generates 4-phase strategic plans with granular tasks and curated learning resources.
- **Progress Tracking**: Localized state persistence allows students to track completed milestones.
- **Professional Export**: High-fidelity PDF export (via `html2pdf.js`) for documentation and sharing.
- **Premium UI/UX**: Built with React, Tailwind CSS, and optimized with the 'Outfit' & 'Lexend' typographic scales.

## 🛠️ Tech Stack

- **Frontend**: React 19 (ES Modules)
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (@google/genai)
- **PDF Generation**: html2pdf.js
- **Icons**: FontAwesome 6

## 📦 Setup & Installation

Since this project uses ESM imports via `esm.sh`, it can be served with any static web server.

1. **Clone the repo**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/project-atlas.git
   cd project-atlas
   ```

2. **Set up API Key**:
   The app expects an environment variable `process.env.API_KEY`. In a local environment, you would typically use a `.env` file or a build tool like Vite to inject this.

3. **Run locally**:
   You can use `npx serve` or any static server:
   ```bash
   npx serve .
   ```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
