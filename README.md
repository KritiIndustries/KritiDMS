# KritiDMS

Overview

This repository contains a full-stack application built with:

React (Frontend)

Node.js / Express (Backend)

Microsoft SQL Server 2022 (Database)

The project includes source code, SQL scripts, and the production React build.

Technology Stack
| Component  | Version                                               |
| ---------- | ----------------------------------------------------- |
| Node.js    | **v20.17.0**                                          |
| React      | **18.3.1**                                            |
| SQL Server | **Microsoft SQL Server 2022 (RTM-GDR)** (16.0.1110.1) |


1. Database Setup (SQL Server 2022)
Create Database & Tables

Open SQL Server Management Studio and execute scripts from:
database/schema.sql

2. Backend Setup (Node.js) Without .env
Step 1 — Navigate to backend
cd backend
Step 2 — Install dependencies
npm install

Step 4 — Run backend (development)
node index.js

3. Frontend Setup (React)
   Step 1 — Navigate to client
   cd client
Step 2 — Install dependencies
   npm install
Step 3 — Start development server
npm run dev


6. Useful Commands Reference
Task	Command
Install backend dependencies	cd backend && npm install
Install frontend dependencies	cd client && npm install
Run backend dev	npm run dev
Run backend prod	npm start
Run frontend dev	npm start
Build frontend	npm run build


