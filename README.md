# HardenShield 🛡️

> AI-powered legacy system hardening advisor

Legacy systems don't announce when they're vulnerable — they just sit there, running end-of-life software, quietly becoming the easiest entry point in your infrastructure. HardenShield was built to change that. Select your OS and services, and HardenShield maps your configuration against known CVEs, scores the risk, and hands you a prioritised hardening plan you can actually act on. No guesswork, no manual trawling through advisories — just clear, actionable output.

Built for security teams, sysadmins, and anyone responsible for systems that probably should have been patched two years ago.

---

## What it does

- Select your **operating system** and **running services** from an intuitive interface
- Maps your configuration against **live CVE data** to identify known vulnerabilities
- Generates a **prioritised hardening plan** ranked by severity
- Provides **executable remediation guidance** for each identified risk
- Focused on **critical infrastructure** and **end-of-life systems** that are commonly overlooked

---

## Tech stack

- **Frontend:** React + Vite
- **Styling:** CSS
- **CVE Mapping:** AI-powered analysis
- **Build tool:** Vite with HMR

---

## Getting started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
git clone https://github.com/Safaabdiasis1234/Hardenshield.git
cd Hardenshield
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for production

```bash
npm run build
```

---

## Project structure

```
Hardenshield/
├── public/          # Static assets
├── src/             # React components and logic
│   ├── components/  # UI components
│   └── main.jsx     # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Background

Legacy systems are everywhere — hospitals, utilities, financial institutions — and they're consistently one of the most exploited attack surfaces in the wild. The problem isn't that people don't know they're vulnerable. It's that the path from "this is risky" to "here's what to do about it" is slow, manual, and often requires expertise that isn't always available.

HardenShield started as a personal project to fix that gap. The goal was simple: build something that takes a system configuration as input and outputs a hardening plan a real engineer could follow — fast, prioritised, and specific to what's actually running.

---

## License

MIT

<img width="2002" height="1770" alt="image" src="https://github.com/user-attachments/assets/2aade160-70a4-4c8b-99b9-ab8ad6145345" />
