# System Architecture

## Backend Design (Clean Architecture)

The backend is structured into four distinct layers to ensure separation of concerns and testability.

### 1. Domain Layer (`EMS.Domain`)
Contains the core business entities.
- **Entities**: `Employee`, `Department`, `Designation`, `Attendance`, `LeaveRequest`, `ApplicationUser`, `ApplicationRole`.
- **Dependencies**: None.

### 2. Application Layer (`EMS.Application`)
Contains the business logic, DTOs, and service interfaces.
- **DTOs**: Data Transfer Objects used for API requests/responses (e.g., `EmployeeDto`, `CreateEmployeeDto`).
- **Interfaces**: Defines the contracts for repositories (`IGenericRepository`) and services.
- **Services**: Implement the business logic (e.g., `EmployeeService` coordinates between repositories and DTOs).
- **Validations**: `FluentValidation` rules for incoming data.
- **Mappings**: `AutoMapper` profiles for Entity $\leftrightarrow$ DTO conversion.

### 3. Infrastructure Layer (`EMS.Infrastructure`)
Handles technical concerns and external integrations.
- **Persistence**: `ApplicationDbContext` manages SQLite connections and entity configurations.
- **Repositories**: `GenericRepository<T>` implements the data access patterns.
- **Services**: `TokenService` handles JWT generation and validation.

### 4. API Layer (`EMS.API`)
The entry point of the system.
- **Controllers**: Expose REST endpoints (e.g., `EmployeesController`).
- **Middleware**: Configures Authentication, Authorization, Serilog logging, and Swagger.

## Database Schema (SQLite)
- **Employees**: Linked to `DepartmentId` and `DesignationId`.
- **Departments**: One-to-Many with Employees.
- **Designations**: One-to-Many with Employees.
- **Attendance**: Linked to `EmployeeId`.
- **LeaveRequests**: Linked to `EmployeeId`.

## Authentication Flow
1. User logs in via `AuthController`.
2. `TokenService` generates a JWT.
3. Frontend stores JWT in `localStorage`.
4. `AuthInterceptor` (Frontend) attaches token to every API request.
5. `JwtBearer` middleware (Backend) validates the token and populates `User.Identity`.
