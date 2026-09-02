# TalentOS by Baalvion

**TalentOS** is an intelligent, global talent acquisition platform designed to connect exceptional talent with borderless opportunity.

This repository contains the frontend application for the **Baalvion Jobs Portal**, a modern recruitment platform that enables companies to manage hiring pipelines while helping candidates discover and apply to opportunities worldwide.

Built using **Next.js**, **TypeScript**, and a scalable modular architecture, TalentOS aims to provide a powerful yet intuitive experience for both recruiters and job seekers.

---

# Live Demo

Coming Soon

---

# Screenshots

*(Add screenshots of the job portal and admin dashboard here)*

Example:

* Job Listings Page
* Job Details Page
* Candidate Application Flow
* Admin Dashboard

---

# Key Features

### Public Job Portal

* SEO-optimized job listings
* Static generation for fast loading
* Detailed job description pages

### Advanced Application Flow

* Multi-step application form
* Resume upload
* Candidate data validation

### Admin Panel

A complete dashboard for recruitment management:

* Job creation and editing
* Candidate tracking
* Interview scheduling
* Offer management
* System settings

### Role-Based Access Control (RBAC)

Different permission levels including:

* Super Admin
* Recruiter
* Interviewer
* Hiring Manager

### AI-Powered Capabilities (Planned)

* Resume parsing
* Candidate scoring
* AI job matching
* Talent recommendations

---

# Tech Stack

### Frontend

* Next.js 14 (App Router)
* React
* TypeScript

### UI & Styling

* Tailwind CSS
* ShadCN/UI
* Responsive design system

### State Management

* Zustand (global state)
* React Context (feature-level state)

### Data Fetching

* SWR for caching and real-time updates

### Backend Integration

Prepared for integration with:

* Firebase
* REST APIs
* Serverless functions

---

# Architecture Overview

TalentOS follows a **scalable frontend architecture** that separates UI logic from backend services.

A **Service Adapter Pattern** is used so that all data interactions go through a dedicated service layer. This enables:

* UI development independent of backend
* Easy swapping between mock data and real APIs
* Cleaner testing and modular development

Adapters include:

* Mock adapter for development
* Server adapter for production APIs

---

# Folder Structure

```
src/
├── app/            Next.js routing, pages, layouts
├── components/     Shared reusable components
├── features/       Feature-based modules
├── services/       Data fetching & service adapters
├── config/         Application configuration
├── lib/            Core utilities, hooks, context
├── types/          TypeScript definitions
├── mocks/          Mock data for development
├── firebase/       Firebase configuration
└── public/         Static assets
```

---

# Getting Started

## Prerequisites

* Node.js v18+
* npm or yarn

---

## Installation

Clone the repository

```
git clone https://github.com/baalvionservice/Baalvion-Jobs-Portal.git
cd Baalvion-Jobs-Portal
```

Install dependencies

```
npm install
```

Create environment file

```
cp .env.example .env
```

Add your configuration values inside `.env`.

---

# Running the Development Server

Start the development server

```
npm run dev
```

Open in your browser:

```
http://localhost:3000
```

Admin panel can be accessed via:

```
/login
```

---

# Available Scripts

```
npm run dev      Start development server
npm run build    Create production build
npm run start    Run production build
npm run lint     Run ESLint
npm run format   Format code with Prettier
```

---

# Roadmap

Future improvements planned for TalentOS:

* AI Resume Parsing
* AI Job Matching Engine
* Video Interview System
* Recruiter Analytics Dashboard
* Notification System
* Multi-tenant company support

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

---

# License

MIT License

Copyright (c) Baalvion

---

# About Baalvion

**Baalvion** is building next-generation platforms for hiring, talent intelligence, and global workforce connectivity.

TalentOS is the first step toward a **fully AI-powered recruitment ecosystem**.
