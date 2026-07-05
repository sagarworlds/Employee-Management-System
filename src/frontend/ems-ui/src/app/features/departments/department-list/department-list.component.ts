import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DepartmentService, Department } from '../department.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  departments: Department[] = [];
  isLoading = false;
  errorMessage = '';
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching departments', err);
        this.errorMessage = 'Failed to load departments. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteDepartment(id: string): void {
    if (confirm('Are you sure you want to delete this department? All employees under this department may become unassigned.')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (err) => {
          console.error('Error deleting department', err);
          alert('Failed to delete department. Ensure you have administrator permissions.');
        }
      });
    }
  }

  editDepartment(id: string): void {
    this.router.navigate(['/departments', id, 'edit']);
  }
}
