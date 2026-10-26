# Moin Mulla — Developer & Cryptographic Systems Portfolio

A high-performance, zero-dependency, interactive developer portfolio for **Moin Mulla** (`moin08s`), showcasing expertise in **Systems Engineering, Applied Cryptography (AES-256-GCM, Ed25519, Merkle Trees), Zero-Dependency Go Architecture, Multimodal AI Pipelines (LLaMA 3.3, BART-MNLI), and Mobile/Full-Stack Development (Flutter, Node.js, Java)**.

[![Live Demo](https://img.shields.io/badge/▶%20Interactive%20Live%20Demo-Click%20Here-brightgreen?style=for-the-badge)](https://moin08s.github.io/stdotp/)
[![GitHub](https://img.shields.io/badge/GitHub-moin08s-blue?style=for-the-badge&logo=github)](https://github.com/moin08s)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Moin%20Mulla-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/moin-mulla-4ba680218/)

---

## ⚡ Key Features

1. **Interactive In-Browser Terminal Emulator**:
   - Custom CLI simulator with commands like `stdotp self-test`, `stdotp init`, `stdotp code github`, `anchor verify`, `whoami`, `skills`, `projects`, and `theme`.
2. **Live Cryptographic Systems Lab**:
   - **RFC 6238 TOTP Authenticator Simulator**: Live rotating 30-second token generator with animated circular countdown ring and one-click copy.
   - **Anchor Merkle Tree Integrity & Tamper Detector**: Live visualizer showing SHA-256 Merkle root computation and real-time cryptographic tamper alarm when injecting modified video frames.
3. **Filterable Featured Projects Grid**:
   - Deep dives into `HR SPHERE` (Diploma Capstone Project in C#.NET/MS SQL, IJARSCT Paper), `stdotp` (Zero Dependency Hackathon 2026 Entry in Pure Go), `TransitPro` (3-tier Java Swing/SQLite Bus Logistics), `MarineGuard MCP` (SIH26057 Ministry of Earth Sciences Sonar AI), `Drishyamitra` (Smart Bridge Telemetry Platform), and `WASP` (Automated DFIR Super-timeline Platform).
   - Interactive Architecture Modals with technical specifications and direct repository links.
4. **Theme Switcher**:
   - High-contrast Dark Cyberpunk mode (default) and clean Light mode with persistent state.
5. **Zero-Build Dependency Architecture**:
   - Pure modern HTML5, Tailwind CSS, Lucide icons, and Vanilla ES6 JavaScript.

---

## 📂 Project Structure

```
c:\Portfolio\
├── index.html              # Main HTML structure with semantic SEO & OpenGraph tags
├── css/
│   └── styles.css          # Glassmorphism, animations, custom scanlines & dark/light theme
├── js/
│   ├── app.js              # Theme switcher, scrollspy, project filters, modal dialogs & toast notifications
│   ├── terminal.js         # Interactive in-browser CLI emulator supporting stdotp & bash commands
│   └── crypto-demo.js      # Real-time TOTP simulator & Merkle tree tamper detection widget
└── README.md               # Portfolio documentation
```

---

## 🚀 Quick Start / Local Preview

You can test this portfolio locally in any browser without needing build steps:

### Option 1: Double-click
Simply open `index.html` in Chrome, Firefox, Safari, or Edge.

### Option 2: Local HTTP Server (Python / Node / Go)
```bash
# Using Python:
python -m http.server 8000

# Using Node (npx):
npx serve .

# Using Go:
go run -m ...
```
Then navigate to `http://localhost:8000`.

---

## 🌐 Free Deployment Guide

### GitHub Pages (Recommended)
1. Push this directory to your GitHub repository `moin08s/moin08s.github.io` (or `moin08s/portfolio`).
2. Go to repository **Settings** $\rightarrow$ **Pages** $\rightarrow$ select **Branch: `main`**, folder `/ (root)`.
3. Your portfolio will immediately be live at `https://moin08s.github.io/`!

### Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. Leave build command empty and output directory as `./`.
3. Click **Deploy**.
