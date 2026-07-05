import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LeaveService, CreateLeaveRequest } from '../leave.service';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  leaveForm!: FormGroup;
  employees: Employee[] = [];
  currentEmployee: Employee | null = null;
  isAdmin = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.initForm();

    if (this.isAdmin) {
      this.loadAllEmployees();
    } else {
      this.loadSelfEmployee();
    }
  }

  private initForm(): void {
    this.leaveForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      leaveType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  private loadAllEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load employee options', err);
        this.errorMessage = 'Failed to load employee profiles.';
        this.isLoading = false;
      }
    });
  }

  private loadSelfEmployee(): void {
    this.isLoading = true;
    this.employeeService.getMe().subscribe({
      next: (emp) => {
        this.currentEmployee = emp;
        this.leaveForm.patchValue({ employeeId: emp.id });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMessage = 'Failed to load your employee profile details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formValue = this.leaveForm.value;

    // Calculate total duration in days
    const start = new Date(formValue.startDate);
    const end = new Date(formValue.endDate);
    
    if (end.getTime() < start.getTime()) {
      this.errorMessage = 'End date cannot be earlier than start date.';
      this.isSubmitting = false;
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const payload: CreateLeaveRequest = {
      employeeId: formValue.employeeId,
      leaveType: formValue.leaveType,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      totalDays,
      reason: formValue.reason
    };

    this.leaveService.applyLeave(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/leave']);
      },
      error: (err) => {
        console.error('Failed to submit leave request', err);
        this.errorMessage = 'Failed to submit leave request. Please check values.';
        this.isSubmitting = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.leaveForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
