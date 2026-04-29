# 🛡️ Complaint Management System

A full-stack Complaint Management System built with **Spring Boot** (backend) and **React + Vite** (frontend).

---

## 📋 Features

### User Features
- 🔐 JWT-based Authentication (Register / Login)
- 📝 Submit complaints with title, description, category, and priority
- 📋 View all personal complaints with filtering & pagination
- 👁️ View detailed complaint information and status updates
- 💬 Add comments to complaints
- 📊 Personal dashboard with complaint overview

### Admin Features
- 📊 Full dashboard with charts (by status & category)
- 👥 Manage all users (activate/deactivate)
- 🔄 Update complaint status, priority, and assign to agents
- 📝 Add resolution notes
- 🔍 Filter complaints by status, category, priority, and keyword

---

## 🏗️ Tech Stack

### Backend
| Technology | Version |
|------------|---------|
| Java       | 17+     |
| Spring Boot | 3.2.0  |
| Spring Security | 6.x |
| Spring Data JPA | - |
| JWT (JJWT) | 0.11.5 |
| H2 Database | Dev |
| MySQL | Production |
| Lombok | - |
| Maven | - |

### Frontend
| Technology | Version |
|------------|---------|
| React | 18.2.0 |
| Vite | 5.0 |
| React Router | v6 |
| TanStack Query | v5 |
| Axios | 1.6 |
| Recharts | 2.10 |
| Tailwind CSS | 3.4 |
| Lucide Icons | - |
| React Hot Toast | - |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- npm / yarn

---

### Backend Setup

```bash
cd backend

# Run with Maven
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**

**H2 Console:** http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:complaintdb`
- Username: `sa`
- Password: (empty)

#### Switch to MySQL
In `src/main/resources/application.properties`, comment out H2 settings and uncomment MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/complaint_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts on **http://localhost:3000**

---

## 🔑 Default Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@complaint.com    | Admin@123  |
| User  | user@complaint.com     | User@123   |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | /api/auth/register   | Register new user   |
| POST   | /api/auth/login      | Login               |
| GET    | /api/auth/me         | Get current user    |

### Complaints
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/complaints                 | List (with filters)      |
| POST   | /api/complaints                 | Create complaint         |
| GET    | /api/complaints/{id}            | Get by ID                |
| PUT    | /api/complaints/{id}            | Update complaint         |
| DELETE | /api/complaints/{id}            | Delete complaint         |
| POST   | /api/complaints/{id}/comments   | Add comment              |
| GET    | /api/complaints/stats           | Dashboard statistics     |

### Users (Admin)
| Method | Endpoint                         | Description         |
|--------|----------------------------------|---------------------|
| GET    | /api/users                       | List all users      |
| GET    | /api/users/{id}                  | Get user by ID      |
| PATCH  | /api/users/{id}/toggle-active    | Toggle user status  |

---

## 📁 Project Structure

```
complaint-management/
├── backend/                        # Spring Boot Application
│   ├── src/main/java/com/complaint/
│   │   ├── ComplaintManagementApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── ComplaintController.java
│   │   │   └── UserController.java
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── model/                 # JPA Entities
│   │   │   └── enums/             # Role, Status, Priority, Category
│   │   ├── repository/            # Spring Data JPA Repositories
│   │   ├── security/              # JWT Filter & UserDetailsService
│   │   └── service/               # Business Logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                       # React Application
    ├── src/
    │   ├── components/layout/     # Layout, Sidebar, Header
    │   ├── context/               # AuthContext
    │   ├── pages/                 # Login, Register, Dashboard, etc.
    │   ├── services/              # Axios API calls
    │   └── utils/                 # Helpers, formatters, badges
    ├── package.json
    └── vite.config.js
```

---

## 🌟 Complaint Statuses
- **OPEN** — Newly submitted, awaiting assignment
- **IN_PROGRESS** — Being actively worked on
- **RESOLVED** — Solution provided
- **CLOSED** — Complaint closed
- **REJECTED** — Complaint rejected

## ⚡ Priority Levels
- **LOW** — Minor issue, no urgency
- **MEDIUM** — Normal priority
- **HIGH** — Significant impact
- **CRITICAL** — Business-blocking issue

---

## 🔒 Security
- JWT Bearer Token Authentication
- Role-based Access Control (ADMIN / AGENT / USER)
- BCrypt password hashing
- CORS configured for frontend origins
- Method-level security with `@PreAuthorize`

---

## 📸 Screenshots
After running the app:
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard  
- **Complaints:** http://localhost:3000/complaints
- **New Complaint:** http://localhost:3000/complaints/new
- **Admin Users:** http://localhost:3000/admin/users (admin only)
