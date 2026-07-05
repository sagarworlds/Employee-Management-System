import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EmployeeService, Employee } from '../employee.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  employees: Employee[] = [];
  isLoading = false;
  errorMessage = '';
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employees', err);
        this.errorMessage = 'Failed to load employees. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Error deleting employee', err);
          alert('Failed to delete employee. Ensure you have administrator permissions.');
        }
      });
    }
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }
}
