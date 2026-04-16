# 📚 Library Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

🚀 **Live Project Demo:** [https://library-management-system-6ewe.vercel.app/](https://library-management-system-6ewe.vercel.app/)

A full-stack, comprehensive Library Management System built with React, Node.js, Express, and PostgreSQL. Features a premium glassmorphic user interface, role-based access control, auto-calculating fine tracking, and detailed analytical reporting.

---

## ✨ Key Features

- **Role-Based Authentication:** Secure JWT-based routing for dual roles: Admin and Standard Users.
- **Transactions Management:** Complete cycle tracking for issuing books/movies, validating 15-day return allocations, and enforcing pending fines.
- **Auto-Calculated Fines:** Generates real-time overdue metrics (₹5/day).
- **Maintenance Dashboards:** Create, update, and manage inventory collections effortlessly.
- **Auto-Indexing Schema:** Standardized ID generation structures (`SCB000001`, `MEM000001`).
- **Comprehensive Reports:** Live tables delivering active issues, overdue returns, and master repository lists.
- **Premium Interface:** Aesthetically appealing dark theme built with modern CSS Glassmorphism logic seamlessly integrated through React.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML, CSS (Vanilla Custom Framework), React.js (Vite)
- `react-router-dom` for secure SPA navigation
- `axios` with interceptors for seamless API calls

**Backend:**
- Node.js & Express.js
- **Database:** PostgreSQL initialized via Prisma ORM
- Security: `bcryptjs` for encryption, `jsonwebtoken` for stateless auth

---

## 🚀 Installation & Setup

To run this project locally, follow these steps:

### 1. Prerequisites
- Node.js installed on your machine.
- PostgreSQL installed and running (default port `5432`).

### 2. Configure Environment Secrets
In the `server/` directory, locate or create your `.env` file and configure your database endpoint and secret key:
```env
DATABASE_URL="postgresql://postgres:<YOUR_DB_PASSWORD>@localhost:5432/library_management?schema=public"
JWT_SECRET="your_secure_secret_string"
PORT=3001
```

### 3. Setup the Backend
Open a terminal, navigate into the `server` folder, and run:
```bash
cd server
npm install
npx prisma migrate dev  # Migrates database schema
npm run db:seed         # Injects dummy data, categories, and standard users
npm run dev             # Starts the API server on http://localhost:3001
```

### 4. Setup the Frontend
Open a completely **new terminal**, navigate into the `client` folder, and run:
```bash
cd client
npm install
npm run dev             # Starts Vite server on http://localhost:5173
```

---

## 🔐 Default Login Credentials

Upon running `npm run db:seed`, the database is populated with two default testing accounts. Navigate to `http://localhost:5173` to test:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Standard User** | `user` | `user123` |

---

## 📂 Project Structure

```text
library-management-system/
├── client/                     # React Vite Frontend Application
│   ├── src/
│   │   ├── assets/             # Images, SVGs, and static assets
│   │   ├── components/         # Reusable structural UI (AppLayout, ProtectedRoute)
│   │   ├── context/            # Global state handling (AuthContext for standard/admin roles)
│   │   ├── pages/              # Nested Dashboard views (Auth, Home, Transactions, Maintenance, Reports)
│   │   └── services/           # Axios networking endpoints connecting frontend to `/api`
├── server/                     # Node/Express Backend Application
│   ├── prisma/                 # Database schema mapping and seed configurations
│   ├── src/
│   │   ├── middleware/         # Security guards (Authentication checks, Admin validations)
│   │   ├── routes/             # RESTful API endpoints separated by logic domains
│   │   ├── utils/              # Helper functions (e.g., dynamic fine calculators)
│   │   └── index.js            # Main backend entry logic and router mounting
```
