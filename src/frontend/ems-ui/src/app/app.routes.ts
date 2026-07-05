import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'employees', 
    loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'employees/new', 
    loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'employees/:id/edit', 
    loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'my-profile', 
    loadComponent: () => import('./features/employees/employee-profile/employee-profile.component').then(m => m.EmployeeProfileComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'departments', 
    loadComponent: () => import('./features/departments/department-list/department-list.component').then(m => m.DepartmentListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'departments/new', 
    loadComponent: () => import('./features/departments/department-form/department-form.component').then(m => m.DepartmentFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'departments/:id/edit', 
    loadComponent: () => import('./features/departments/department-form/department-form.component').then(m => m.DepartmentFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'designations', 
    loadComponent: () => import('./features/designations/designation-list/designation-list.component').then(m => m.DesignationListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'designations/new', 
    loadComponent: () => import('./features/designations/designation-form/designation-form.component').then(m => m.DesignationFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'designations/:id/edit', 
    loadComponent: () => import('./features/designations/designation-form/designation-form.component').then(m => m.DesignationFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'attendance', 
    loadComponent: () => import('./features/attendance/attendance-list/attendance-list.component').then(m => m.AttendanceListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'leave', 
    loadComponent: () => import('./features/leave/leave-list/leave-list.component').then(m => m.LeaveListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'leave-requests', 
    redirectTo: 'leave',
    pathMatch: 'full'
  },
  { 
    path: 'leave/new', 
    loadComponent: () => import('./features/leave/leave-form/leave-form.component').then(m => m.LeaveFormComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
