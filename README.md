# SkillMatch Frontend

SkillMatch Frontend adalah aplikasi web berbasis React yang membantu pengguna menganalisis kecocokan skill terhadap posisi pekerjaan tertentu menggunakan machine learning. Aplikasi ini menyediakan fitur analisis skill, visualisasi hasil, rekomendasi skill, serta rekomendasi lowongan berdasarkan hasil matching.

---

# Features

* Authentication (Login/Register)
* Skill Analysis & Matching
* Skill Gap Analysis
* Recommendation Engine
* Profile Management
* Dashboard Visualization
* Responsive UI
* Integration with FastAPI Backend

---

# Tech Stack

Frontend:

* React
* Vite
* React Router
* TailwindCSS
* Recharts
* Lucide React

Backend Integration:

* FastAPI
* Railway Deployment

Deployment:

* Vercel (Frontend)
* Railway (Backend)

---

# Project Structure

```
src/
│
├── components/
│   ├── ui.jsx
│   ├── ErrorBanner.jsx
│
├── hooks/
│   └── useAnalyze.js
│
├── lib/
│   ├── api.js
│   ├── storage.js
│   └── skills.js
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Analysis.jsx
│   ├── Jobs.jsx
│   └── Profile.jsx
│
├── App.jsx
└── main.jsx
```

---

# Installation Guide

## 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/skillmatch-frontend.git
```

Masuk ke folder project:

```
cd skillmatch-frontend
```

---

## 2. Install Dependencies

Menggunakan npm:

```
npm install
```

atau:

```
npm i
```

---

## 3. Configure Environment Variables

Buat file:

```
.env
```

Isi dengan:

```
VITE_API_URL=https://YOUR_BACKEND_URL
```

Contoh:

```
VITE_API_URL=https://skilmatch.up.railway.app
```

---

## 4. Run Development Server

```
npm run dev
```

Frontend akan berjalan pada:

```
http://localhost:5173
```

---

# Production Build

Generate build production:

```
npm run build
```

Preview build:

```
npm run preview
```

---

# Backend Integration

Frontend melakukan komunikasi API menggunakan:

```
VITE_API_URL
```

Contoh endpoint:

```
POST /match
POST /recommend
POST /extract-skill
GET /health
```

Pastikan backend aktif sebelum menjalankan frontend.

---

# Deployment Guide (Vercel)

## Step 1

Push project ke GitHub.

## Step 2

Masuk ke:

```
https://vercel.com
```

## Step 3

Import repository GitHub.

## Step 4

Tambahkan Environment Variable:

Name:

```
VITE_API_URL
```

Value:

```
https://YOUR_BACKEND_URL
```

## Step 5

Klik Deploy.

---

# Environment Variables

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |

---

# Available Scripts

Start development:

```
npm run dev
```

Build production:

```
npm run build
```

Preview production build:

```
npm run preview
```

Lint:

```
npm run lint
```

# Future Improvements

* Real-time analytics
* Personalized recommendations
* Skill trend prediction
* More job categories
* Better accessibility support

---

# Contributors

Developer:

Your Name

---

# License

This project is developed for educational and portfolio purposes.
