#IMP - If mail limit exceeded msg occur when signup process check EMERGENCY FILE INSIDE DOCUMENTATION FOLDER(ITS NOT AN ERROR)
📌 Smart Link Hub

Smart Link Hub is a Linktree-like web application that allows users to organize, manage, and share multiple links through a single public hub page. It also provides analytics and rule-based link display to improve link visibility and performance.

🌐 Live Deployment

Website Link:
👉 https://smartlink-hub.netlify.app/

📂 GitHub Repository

Repository Link:
👉 https://github.com/abhijit-1011/Smart-Link-Hub.git

🛠️ Technology Stack-
Frontend

HTML
CSS
JavaScript

Backend & Database

Supabase (Authentication + Database(PostgresSQL)) -RLS policies to the table
Hosting - Netlify


🚀 Setup & Installation (Local Run)

Follow these steps to run the project locally:

Step 1: Clone the Repository
git clone https://github.com/abhijit-1011/Smart-Link-Hub.git

Step 2: Open in VS Code

Open the project folder in Visual Studio Code.

Step 3: Configure Supabase

Go to:
Frontend/assets/js/supabase.js
Added Supabase URL and Anon Key:

const SUPABASE_URL = " https://nyghnjxdokohsolgxcml.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z2huanhkb2tvaHNvbGd4Y21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzQ5MDMsImV4cCI6MjA4NDcxMDkwM30.ADyNSHr2fGpkktVJq0SXgnOm_X_gbA8P6Z5WmxUbsAo";

Step 4: Run Using Live Server

Install Live Server extension in VS Code

Right-click on index.html

Click Open with Live Server


📌 How to Use

Open the website

Register/Login using Supabase Auth

Create your hub from Dashboard

Add links

Apply rules if required

Share your public hub link

Track analytics from dashboard




👥 Team Information

Team Name: CodeWarriors (Hackathon Project, 2026)

Team Members

Abhijit Deshmukh – Team Leader (Backend)

Sarvesh Londhe – Testing & Debugging

Akshay Narote – Frontend

Sanskar Mane – Frontend Logic


📧 Contact: abhijitdeshmukh870@gmail.com


📖 Project Overview

Smart Link Hub enables users to:

Create one public hub page using a unique slug

Add multiple links inside the hub

Track hub visits and link clicks

Apply rule-based link display

Manage everything from a secure dashboard

The platform is designed for creators, students, and professionals who want to share multiple links easily and analyze their performance.


⚙️ Features
🔹 User Features

Secure login and authentication(Email Verification)

Create and edit hub profile

Add and delete links

Generate QR code for hub

Share hub URL

🔹 Analytics

Track total hub visits

Track link clicks

Identify top-performing links

🔹 Rule-Based Link Display

Each link can have conditions such as:

⏰ Time-based rules (Start Time – End Time)

💻 Device-based rules (Mobile / Desktop)

🌍 Country-based rules (IN, US, UK, etc.)

⭐ Priority system for link ranking

🔹 Dashboard

Private access (login required)

Link management

Rule configuration

Analytics dashboard


🗂️ Database Tables (Supabase)

The project uses the following tables: RLS policies IS also Added

profiles – User profiles

hubs – Hub information

links – User links

rules – Rule-based display settings

hub_visits – Hub visit tracking

click_events – Link click tracking


🎯 Project Purpose

We built Smart Link Hub to:

Help users manage all important links in one place

Provide a single public hub URL

Enable tracking of link performance

Learn full-stack development with Supabase

Build a practical project for hackathons and placements

Implement smart rule-based link management



📁 Project Structure (Simplified)
Smart-Link-Hub/
│
├── frontend/
│   ├── index.html
│   ├── hub.html
│   ├── dashboard.html
│   ├── about.html
│   ├── login.html
│   ├── signup.html
│   │
│   └── assets/
│       └── js/
│           ├── analytics.js
│           ├── auth.js
│           ├── dashboard.js
│           ├── hub.js
│           ├── qr.js
│           ├── rules.js
│           └── supabase.js
│
└── documentation/

📦 Submission Package

This project submission includes:

✔️ Live Deployed Website
✔️ Public GitHub Repository
✔️ Complete Source Code
✔️ README Documentation
✔️ Zipped Project File

🏆 Future Enhancements

Admin panel

More advanced analytics

Multiple rules per link

Theme customization

Mobile app version

Location detection automation

📜 License

This project is developed for educational, hackathon, and learning purposes.

© 2026 CodeWarriors Team
