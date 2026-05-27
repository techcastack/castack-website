# Castack Enterprise Software & Agentic AI Website

Welcome to the **Castack** Full-Stack Enterprise Platform. This repository holds a world-class, premium, modern website designed to look and perform like a top AI/SaaS/Enterprise software studio. 

---

## 🚀 Primary Technologies

### Frontend:
*   **React 19 (Vite)**: For modular, blazing-fast client loading.
*   **Tailwind CSS**: Custom styling, dark mode grids, and harmony color systems.
*   **Framer Motion**: Smooth page-curtain transitions, click-hover scale responses, and active drawer slides.
*   **GSAP & ScrollTrigger**: Viewport-tied entrance reveals and parallax statistics scrolling.
*   **Lenis Scroll**: Natural, smooth inertial mouse wheel momentum.
*   **React Three Fiber & Drei (WebGL)**: Interactive orbital particle globe inside the landing hero background.
*   **Zustand**: Clean, centralized global client store for state management.
*   **Axios**: Configured HTTP client with automatic JWT header interceptors.

### Backend:
*   **Node.js & Express.js**: High-performance modular server routers and error catchers.
*   **MongoDB & Mongoose**: Meticulous schemas, indexes, and automated data validators.
*   **JWT Auth**: Secure admin tokenization.
*   **Multer**: File upload filters restricted to PDF/DOCX resumes with size caps.
*   **pdf-parse & mammoth**: Local parser engine to extract raw resume strings.
*   **ATS Grading Engine**: Algorithm extracting target keywords density, skills gaps, structure checks, and suggestions.
*   **Nodemailer**: Email notifications alert templates.
*   **Helmet & Rate Limiter**: Security protections against DDoS and brute force.
*   **Winston**: Stream log file captures.

---

## 📂 Repository Folder Structure

```
castacknew/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Static assets, branding favicon
│   ├── src/
│   │   ├── assets/         # logo-dark, logo-light, global styles
│   │   ├── components/     # UI low-level units & common wrappers
│   │   ├── store/          # Zustand global useStore
│   │   ├── services/       # Axios API client
│   │   ├── features/       # Modular features pages
│   │   └── main.jsx
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # DB, Logger, Seeder configs
│   │   ├── middleware/     # JWT protect, upload, rate-limit, errors
│   │   ├── models/         # Mongoose Schemas
│   │   ├── controllers/    # API Request handlers
│   │   ├── routes/         # Endpoint mappings
│   │   └── server.js       # Main server entrypoint
├── package.json            # Root orchestrator scripts
└── README.md
```

---

## 🛠️ Step-by-Step Installation & Booting

### 1. Prerequisite Installations
*   Make sure you have **Node.js** (v18+) and **MongoDB** installed and running locally on your system.

### 2. Seeding the Database
To populate jobs, blogs, and create the default admin account:
```bash
# In the root project folder:
npm run seed
```
*Administrative Credentials Seeded:*
*   **Email:** `admin@castack.com`
*   **Password:** `CastackAdminSecure2026!`

### 3. Running Front-End & Back-End Concurrently
To boot up both the Express server (port `5000`) and the Vite client (port `5173`) in one command:
```bash
# In the root project folder:
npm run dev
```

---

## 🧠 ATS Resume Parser & Diagnostics

Our local ATS Engine performs real-time grading:
1.  **Skills Score (40 Points):** Validates the resume text for technical keywords required in the target role.
2.  **Experience Score (30 Points):** Evaluates if the candidate's parsed tenure matches the seniority tier constraints (Junior, Mid, Senior, Lead).
3.  **Readability Score (30 Points):** Evaluates structural document headings (Education, Skills, Projects, Certifications) and checks text lengths.
4.  **Keyword Density:** Details frequencies of non-stop words.
5.  **Suggestions:** Dynamic checklists detailing missing tech keywords, formatting tips, and action steps to pass corporate screening layers.

---

## 🔒 Security Measures

*   **Helmet Policies:** Applies appropriate headers protecting client details.
*   **Brute-Force Limiters:** Restricts authentication attempts and file uploads dynamically.
*   **Tokenization Gates:** Exposes applicant ledger, CRUD tools, and resume downloading scopes only to logged admins.
