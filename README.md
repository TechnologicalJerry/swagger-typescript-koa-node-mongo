# Koa.js TypeScript Enterprise Backend

A production-ready, highly scalable, enterprise-grade backend API built with **Koa.js**, **TypeScript**, and **MongoDB**. This project provides a robust foundation for building modern web applications, featuring built-in authentication, role-based access control, request validation, automated API documentation via Swagger, and Docker support.

## 🚀 Tech Stack

- **Framework:** Koa.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) with short-lived Access and long-lived Refresh tokens
- **Security:** Helmet, CORS, Rate Limiting, bcrypt
- **Logging:** Pino & pino-pretty
- **Documentation:** Swagger UI & OpenAPI 3.0
- **Containerization:** Docker & Docker Compose

## ✨ Features

- **Modular Architecture:** Clean separation of concerns using Controllers, Services, Repositories, and Routes.
- **Robust Authentication:** Secure user registration, login, token refresh, and logout functionalities.
- **Role-Based Access Control:** Protect routes and actions based on user roles (e.g., `user`, `admin`).
- **Comprehensive Validation:** Strong, typed request body, query, and parameter validation using Zod schemas.
- **Global Error Handling:** Centralized middleware for catching, formatting, and returning meaningful API errors.
- **Interactive API Docs:** Auto-generated Swagger documentation available directly in the browser.
- **Developer Experience:** Configured with strict TypeScript, ESLint, Prettier, and Nodemon for rapid development.

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally on port `27017` or a cloud URI)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TechnologicalJerry/swagger-typescript-koa-node-mongo.git
cd swagger-typescript-koa-node-mongo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Copy the example environment file and customize the variables as needed:

```bash
cp .env.example .env
```

Ensure you update the `JWT_SECRET` and `JWT_REFRESH_SECRET` for security. If you are running MongoDB locally, the default `MONGO_URI` (`mongodb://localhost:27017/koa-db`) will work perfectly.

### 4. Running the Application locally

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## 🐳 Running with Docker

You can easily spin up the entire stack (Node.js App + MongoDB) using Docker Compose.

```bash
docker-compose up --build
```
To run it in the background (detached mode), use `docker-compose up --build -d`.

## 📚 API Documentation

Once the server is running, you can access the interactive Swagger UI to explore and test the API endpoints.

👉 **Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

*(Make sure to authenticate via the `/api/v1/auth/login` endpoint and paste your token into the "Authorize" button at the top of the Swagger page to test protected routes!)*

## 📁 Folder Structure

```text
src/
├── config/             # Configuration files and environment variables
├── controllers/        # Route handlers (HTTP layer)
├── database/           # Database connection setup
├── middlewares/        # Custom Koa middlewares (auth, validation, errors)
├── models/             # Mongoose schemas and interfaces
├── repositories/       # Data Access Layer (database queries)
├── routes/             # API route definitions
├── services/           # Core business logic
├── swagger/            # OpenAPI/Swagger configurations
├── utils/              # Utility classes and helper functions
├── validations/        # Zod validation schemas
├── app.ts              # Koa application instance setup
└── server.ts           # Application entry point
```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).