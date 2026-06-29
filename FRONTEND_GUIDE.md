# Frontend Implementation Guide

## Angular Architecture
The frontend uses a **Standalone Component** architecture, reducing the need for `NgModules`.

### Core Services
- **`ApiService`**: The central point for all HTTP communication. All feature services should use this to ensure consistent error handling and request formatting.
- **`AuthService`**: Manages session state, token storage, and login/logout logic.

### Feature Structure
Each feature is organized under `src/app/features/<feature-name>`.
- **Service**: Handles API calls for that specific feature (e.g., `EmployeeService`).
- **Components**: Split into `list` (for tables) and `form` (for Create/Update).

## State Management
The app currently uses a **Service-based state** (storing data in services and using Observables). For the current scale, this is sufficient.

## Development Workflow
1. **Adding a New Feature**:
    - Create a service for the entity.
    - Create a List component to display data.
    - Create a Form component for adding/editing.
    - Add routes to `app.routes.ts`.
    - Add navigation links to the Sidebar.

## Styling Guidelines
- **Framework**: Tailwind CSS (Implementation Pending).
- **Patterns**:
    - Use a consistent color palette for primary actions (Blue/Indigo), success (Green), and danger (Red).
    - Tables should be responsive and include action buttons (Edit/Delete).
    - Forms should use `ReactiveFormsModule` for validation.
