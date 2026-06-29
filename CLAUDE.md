# EMS - Project Guide

Employee Management System (EMS) is a full-stack application designed to manage employees, departments, designations, attendance, and leave requests.

## 🛠 Tech Stack
- **Backend**: .NET 10, Entity Framework Core, SQLite, JWT Authentication.
- **Frontend**: Angular (Standalone Components), Tailwind CSS (Planned).
- **Architecture**: Clean Architecture (Domain $\rightarrow$ Application $\rightarrow$ Infrastructure $\rightarrow$ API).

## 🚀 Quick Start

### Backend
1. Navigate to `src/backend/EMS.API`
2. Run: `dotnet run`
3. The API will be available at the port specified in `launchSettings.json`.
4. Database: SQLite (`EMS.db`) is automatically created on first run if migrations are applied.

### Frontend
1. Navigate to `src/frontend/ems-ui`
2. Run: `npm install` (if first time)
3. Run: `ng serve`
4. Access via: `http://localhost:4200`

## 🏗 Key Patterns
- **Backend**: 
    - Uses `IGenericRepository<T>` for data access.
    - Business logic resides in `Application/Services`.
    - Request validation via `FluentValidation`.
    - Data transformation via `AutoMapper`.
- **Frontend**:
    - `ApiService` handles all HTTP calls.
    - `AuthService` manages JWT tokens in `localStorage`.
    - Standalone components are used for all features.

## 📁 Project Structure
- `src/backend/EMS.Domain`: Entities and core domain logic.
- `src/backend/EMS.Application`: DTOs, Interfaces, and Business Services.
- `src/backend/EMS.Infrastructure`: Database context and Repository implementations.
- `src/backend/EMS.API`: Controllers and API configuration.
- `src/frontend/ems-ui`: Angular application source code.
