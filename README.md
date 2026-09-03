# 🤖 AI Gym Trainer

A fitness-oriented **AI web application** built with Next.js, React, TypeScript, Tailwind CSS, generative AI, and Prisma.

## 🖼️ Application Architecture

```mermaid
flowchart LR
    U[User] --> UI[Next.js / React UI]
    UI --> AI[Generative AI]
    UI --> DB[(Prisma Database)]
    AI --> UI
    DB --> UI
```

## ✨ Overview

The project explores how generative AI can be integrated into a modern web application to create an interactive fitness-focused experience. The frontend provides the user interface while server-side logic connects AI functionality and persistent data.

## 🧰 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![AI](https://img.shields.io/badge/AI-Generative-blue)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

## 🚀 Getting Started

```bash
npm install
```

Create a local `.env` file containing the database and AI configuration required by the application, then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## 📜 Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 🎯 What This Project Demonstrates

- AI integration in a full-stack TypeScript application
- Modern React / Next.js application structure
- Database access with Prisma
- Responsive UI development with Tailwind CSS
- Environment-based configuration for external services

## 📌 Status

Active learning / development project.

## 👨‍💻 Author

**Dreamjain** — [GitHub](https://github.com/Dreamjain)
