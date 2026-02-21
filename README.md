# Task Management API - Backend

This is a robust Task Management API built with **Node.js**, **Express**, and **TypeScript**. It features secure authentication via **Auth0**, data persistence with **MongoDB**, and complex business logic for task lifecycle management.

## 🚀 Teck Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Language**: TypeScript
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: Auth0 (JWT Strategy)
*   **Testing**: Jest & ts-jest
*   **Communication**: JSON REST API

## ✨ Key Features

### 1. Secure Authentication
All endpoints are protected using **Auth0**. The API validates JWT tokens sent in the `Authorization` header. Custom type definitions ensure that the authenticated user's information (`auth.payload.sub`) is accessible throughout the request lifecycle.

### 2. Task Lifecycle & Business Rules
The API enforces strict rules for task management:
*   **Status Transitions**: `PENDING` → `IN_PROGRESS` → `DONE` → `ARCHIVED`.
*   **Ownership**: Users can only access, modify, or delete tasks they created.
*   **Immutability**: Once a task is marked as `DONE`, only the `title` can be modified (for typo fixes). Other fields become read-only.
*   **External Verification**: Marking a task as `DONE` requires approval from an external **Completion Service** via a web service call.

### 3. Integrated Completion Service (External Validation)
A secondary microservice, located in `src/completion-service`, acts as an external validation gate. This simulates a real-world scenario where a task completion must be authorized by a separate business unit or a Cloud Function.

*   **Port**: 4000
*   **Interaction**: When a user hits the `/markAsDone` endpoint on the main API (Port 3000), the backend makes an internal HTTP request to the Completion Service (Port 4000) to get an "Approved" flag.
*   **Requirement Fit**: This implements the requirement for "Marking a task as Done using an API web service".

### 4. Automatic Testing
Comprehensive unit tests cover the core business logic, including:
*   Validation of invalid status transitions.
*   Ownership and authorization checks.
*   Consistency rules for completed tasks.

## 🛠️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add:
    ```env
    PORT=3000
    MONGO_DB_URI=your_mongodb_connection_string
    # Auth0 configuration is handled in src/middleware/authMiddleware.ts
    ```

## 🏃 Running the Project

1.  **Start the main API**:
    ```bash
    npm run dev
    ```

2.  **Start the Completion Service** (Required for marking tasks as DONE):
    ```bash
    npm run completion-service
    ```

## 🧪 Testing

Run the Jest unit test suite:
```bash
npm test
```

## 🛣️ API Endpoints

All endpoints (except health check) require a valid Auth0 Bearer Token.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks for the authenticated user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task details (title, description, status) |
| `PUT` | `/api/tasks/:id/markAsDone` | Mark a task as DONE (requires external approval) |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/health` | API Health check (Public) |

---
*Developed as part of a technical technical test.*
