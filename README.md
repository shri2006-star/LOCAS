# 🏦 LOCAS - Loan Origination & Credit Assessment System

![Java 17](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5-purple.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5-1890ff.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**LOCAS** is a full-stack, enterprise-grade **Loan Origination and Credit Assessment System**. It streamlines loan applications, credit risk scoring, customer analytics, and approval workflows.

---

## 📌 Features

- 📄 **Loan Application Management**: End-to-end loan origination and applicant tracking.
- 📊 **Credit Assessment & Analytics**: Dynamic credit scoring, risk evaluation, and interactive data visualization charts.
- 🔐 **Secure Authentication**: Role-based access control with JWT tokens and Spring Security.
- ⚡ **Modern Dashboard**: Responsive, sleek UI built with React 18, Ant Design, and Recharts.
- 🐳 **Docker Ready**: Pre-configured Docker containerization and Docker Compose setup.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Ant Design, Recharts, Axios, React Router v6 |
| **Backend** | Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security, JWT |
| **Database** | MySQL / H2 Database, Flyway Migration |
| **DevOps** | Docker, Docker Compose, Maven |

---

## 📁 Repository Structure

```text
LOCAS/
├── 📂 locas-frontend/       # React (Vite) User Interface
├── 📂 locas-backend/        # Spring Boot REST API Service
├── 📜 seed_locas_database.sql # Database Initialization & Sample Data
├── 📜 START_LOCAS_BACKEND.bat # Shortcut Script to Launch Backend
├── 📜 LOCAS_PROJECT_REPORT.pdf # Complete System Design & Documentation
├── 📜 .gitignore            # Git exclusion rules
└── 📜 README.md             # Project Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v18+) & `npm`
- **Java JDK** (v17+)
- **Maven** (or use included `mvnw`)
- **MySQL Database** (Optional if using H2 in-memory mode)

---

### 1️⃣ Run the Backend (Spring Boot)

```bash
# Navigate to backend directory
cd locas-backend

# Run using Maven Wrapper
./mvnw spring-boot:run
```
> The API will start on **`http://localhost:8080`**.  
> Swagger OpenAPI Docs are available at: `http://localhost:8080/swagger-ui.html`

---

### 2️⃣ Run the Frontend (React)

```bash
# Navigate to frontend directory
cd locas-frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> The frontend application will be live on **`http://localhost:3000`**.

---

### 3️⃣ Docker Setup (Alternative)

Run both Backend & Database in a single command using Docker:

```bash
cd locas-backend
docker-compose up --build
```

---

## 🗄️ Database Setup

Import sample seed data into your MySQL database using:
```bash
mysql -u root -p < seed_locas_database.sql
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
