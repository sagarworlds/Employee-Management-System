# Employee Management System (EMS)

A modern, full-stack Employee Management System built using a **Clean Architecture** backend in ASP.NET Core and a responsive **Standalone Component** frontend in Angular.

---

## 🚀 Key Features

### 🔐 Authentication & Role-Based Access
* **Secure JWT Login**: Secure authentication with JSON Web Tokens (JWT) stored in client storage.
* **Role-Based Views**: Dynamic sidebar navigation adapting to roles:
  * **Admin Panel**: Employee CRUD, Department & Designation Management, Attendance auditing, and Leave Request approval.
  * **Self Service (Employee Panel)**: Personal profile details, daily Clock-In/Clock-Out logging, and vacation/medical leave applications.
* **Email-Based Account Linking**: Fully automated linking behind the scenes. When a new Employee record is created or a user registers, the system matches their email address and links the login credentials to their professional profile automatically.

### 👥 Employee Profile & Directory
* **Interactive Directory**: Detailed directory list with searchable details, status indicators, and department/designation badges.
* **Complete Employee Profile**: Centralized profile tracking including salary, contact information, date of birth, and date of joining.

### 🏢 Department & Designation Configuration
* **Business Units**: Track organizational divisions (e.g. IT, HR, Marketing) and employee counts per department.
* **Grade/Titles**: Configure job titles, grades, and descriptions.

### ⏱️ Attendance Logging
* **Interactive Clock Card**: Single-click Clock-In and Clock-Out widget for employees.
* **Late Flags**: Automatically flags arrivals after 9:15 AM as `Late`, otherwise marking them as `Present`.
* **Remarks Logging**: Allows logging custom shift remarks on check-out.
* **Admin Auditing**: Allows administrators to view, log, or override shifts for any employee.

### 📅 Leave Requests
* **Validation & Calculations**: Automatic leave duration calculation (`totalDays`) with checks preventing out-of-order date entries.
* **Approval Workflows**: Streamlined dashboard allowing admins to review, approve, or reject pending requests. Employees can cancel their own pending requests.

### 📊 Metric Dashboard
* **Dynamic Counters**: Live counts of employees, departments, and pending requests loaded dynamically using RxJS.

---

## 🛠️ Tech Stack

### Backend (ASP.NET Core Web API)
* **Architecture**: Clean Architecture pattern (Domain, Application, Infrastructure, API).
* **Database**: Entity Framework Core with SQLite (`ems.db`).
* **Validation**: FluentValidation.
* **Mapping**: AutoMapper conversions between Entities and DTOs.
* **Auditing**: Overridden `SaveChangesAsync` which automatically writes record additions, modifications, and deletions into an `AuditLogs` table.

### Frontend (Angular)
* **Architecture**: Angular Standalone Components (no `NgModule` clutter) and modular services.
* **Routing**: Lazy-loaded routes guarded by an asynchronous `AuthGuard`.
* **State Management**: Service-based reactive state using Observables.
* **Styling**: Vanilla SCSS utilizing a centralized CSS Variable design system (colors, borders, status badges, typography).
* **Polyester/Polyfills**: Integrated `zone.js` for automatic change detection during asynchronous HTTP events.

---

## 🏗️ Project Architecture

```
src/
├── backend/
│   ├── EMS.Domain/         # Business entities (Employee, Department, AuditLog, etc.)
│   ├── EMS.Application/    # Interfaces, DTOs, Services business logic, Mappings, Validators
│   ├── EMS.Infrastructure/ # Persistence layer, SQLite DbContext, Migrations, JWT Token generation
│   └── EMS.API/            # Controllers and HTTP endpoints
└── frontend/
    └── ems-ui/             # Angular Standalone application
```

---

## 🏃 Run the Application

### 💾 1. Database Setup
The SQLite database file `EMS.db` is configured in `appsettings.json`. Migrations are pre-configured. To update or create the database:
```bash
# Navigate to the backend directory
cd src/backend

# Apply migrations
dotnet ef database update --project EMS.Infrastructure --startup-project EMS.API
```

### 🖥️ 2. Run the Backend API
You can run the API from your IDE (Visual Studio / VS Code) or the CLI:
```bash
# Run from the API directory
cd src/backend/EMS.API
dotnet run
```
* The API runs locally on: `https://localhost:7013` (HTTP: `http://localhost:5232`)
* Swagger UI is available for endpoint testing at: `https://localhost:7013/swagger/index.html`

### 🌐 3. Run the Frontend Angular App
Ensure you have Node.js installed, then execute:
```bash
# Navigate to the Angular project
cd src/frontend/ems-ui

# Install dependencies
npm install

# Run the local development server
npm start
```
* The UI runs locally on: `http://localhost:4200`
* Setup includes CORS policies allowing communication between port `4200` and port `7013`.

---

## 🔑 Seeded Test Accounts

The system comes pre-populated with these user login accounts for testing:

| Username | Password | Role | Description |
|---|---|---|---|
| `admin` | `Admin123!` | **Admin** | System manager with access to all CRUD & approval controls. |
| `user1` | `User123!` | **Employee** | Seeded employee profile representing **John Doe**. |
| `user2` | `User123!` | **Employee** | Seeded employee profile representing **Jane Smith**. |

> **Note on Initial Setup**: When logging in as `admin` for the first time, make sure to add an employee record with the email `admin@ems.com` under **Employees -> Add Employee**. This automatically links your admin account to a professional employee card, enabling the self-service Clock-In/Clock-Out features on the dashboard.
