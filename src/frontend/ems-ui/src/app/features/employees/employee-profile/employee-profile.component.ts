import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee } from '../employee.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  private employeeService = inject(EmployeeService);

  employee: Employee | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getMe().subscribe({
      next: (data) => {
        this.employee = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile details', err);
        this.errorMessage = 'Failed to load your profile. Please ensure your user account is linked to an employee record.';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
