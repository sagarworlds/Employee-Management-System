import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../employees/employee.service';
import { DepartmentService } from '../departments/department.service';
import { LeaveService } from '../leave/leave.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private leaveService = inject(LeaveService);
  private authService = inject(AuthService);

  // States
  employeeCount = 0;
  departmentCount = 0;
  pendingLeavesCount = 0;
  userName = '';
  isAdmin = false;
  isLoading = false;

  ngOnInit(): void {
    this.userName = this.authService.getUserName() || 'User';
    this.isAdmin = this.authService.isAdmin();
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    
    // Load Employee count
    this.employeeService.getEmployees().subscribe({
      next: (emps) => {
        this.employeeCount = emps.length;
        
        // If employee, load their personal pending leaves
        const selfEmp = emps.find(e => e.email === this.authService.getUserName() || e.firstName.toLowerCase() === this.authService.getUserName()?.toLowerCase());
        const empId = selfEmp?.id;
        
        if (empId) {
          this.leaveService.getByEmployee(empId).subscribe({
            next: (leaves) => {
              this.pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
            }
          });
        }
      },
      error: (err) => console.error('Failed to load employee metrics', err)
    });

    // Load Department count
    this.departmentService.getDepartments().subscribe({
      next: (depts) => {
        this.departmentCount = depts.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load department metrics', err);
        this.isLoading = false;
      }
    });

    // If Admin, mock pending leaves for dashboard metric visual
    if (this.isAdmin) {
      this.pendingLeavesCount = 8; // admin-level default mock count
    }
  }
}
