import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService, CreateEmployee, UpdateEmployee } from '../employee.service';
import { DepartmentService, Department } from '../../departments/department.service';
import { DesignationService, Designation } from '../../designations/designation.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private designationService = inject(DesignationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  departments: Department[] = [];
  designations: Designation[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployeeData(this.employeeId);
    }
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfJoining: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      designationId: ['', [Validators.required]],
      salary: [0, [Validators.required, Validators.min(1)]],
      address: ['', [Validators.maxLength(500)]],
      status: ['Active'],
      isActive: [true]
    });
  }

  private loadDropdownData(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data.filter(d => d.isActive),
      error: (err) => console.error('Failed to load departments', err)
    });

    this.designationService.getDesignations().subscribe({
      next: (data) => this.designations = data.filter(d => d.isActive),
      error: (err) => console.error('Failed to load designations', err)
    });
  }

  private loadEmployeeData(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employeeForm.patchValue({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          dateOfBirth: this.formatDate(emp.dateOfBirth),
          gender: emp.gender,
          dateOfJoining: this.formatDate(emp.dateOfJoining),
          departmentId: emp.departmentId,
          designationId: emp.designationId,
          salary: emp.salary,
          address: emp.address,
          status: emp.status,
          isActive: emp.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load employee details', err);
        this.errorMessage = 'Failed to load employee details.';
        this.isLoading = false;
      }
    });
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formValue = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      const updatePayload: UpdateEmployee = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        dateOfBirth: new Date(formValue.dateOfBirth).toISOString(),
        gender: formValue.gender,
        dateOfJoining: new Date(formValue.dateOfJoining).toISOString(),
        departmentId: formValue.departmentId,
        designationId: formValue.designationId,
        salary: formValue.salary,
        address: formValue.address || null,
        status: formValue.status,
        isActive: formValue.isActive
      };

      this.employeeService.updateEmployee(this.employeeId, updatePayload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Failed to update employee', err);
          this.errorMessage = 'Failed to update employee. Please check details.';
          this.isSubmitting = false;
        }
      });
    } else {
      const createPayload: CreateEmployee = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        dateOfBirth: new Date(formValue.dateOfBirth).toISOString(),
        gender: formValue.gender,
        dateOfJoining: new Date(formValue.dateOfJoining).toISOString(),
        departmentId: formValue.departmentId,
        designationId: formValue.designationId,
        salary: formValue.salary,
        address: formValue.address || null,
        applicationUserId: null
      };

      this.employeeService.createEmployee(createPayload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Failed to create employee', err);
          this.errorMessage = 'Failed to add employee. Please ensure all values are valid.';
          this.isSubmitting = false;
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
