import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService, CreateDepartment, UpdateDepartment } from '../department.service';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  departmentForm!: FormGroup;
  isEditMode = false;
  departmentId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initForm();

    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (this.departmentId) {
      this.isEditMode = true;
      this.loadDepartmentData(this.departmentId);
    }
  }

  private initForm(): void {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  private loadDepartmentData(id: string): void {
    this.isLoading = true;
    this.departmentService.getDepartmentById(id).subscribe({
      next: (dept) => {
        this.departmentForm.patchValue({
          name: dept.name,
          description: dept.description,
          isActive: dept.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load department details', err);
        this.errorMessage = 'Failed to load department details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formValue = this.departmentForm.value;

    if (this.isEditMode && this.departmentId) {
      const updatePayload: UpdateDepartment = {
        name: formValue.name,
        description: formValue.description || null,
        isActive: formValue.isActive
      };

      this.departmentService.updateDepartment(this.departmentId, updatePayload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/departments']);
        },
        error: (err) => {
          console.error('Failed to update department', err);
          this.errorMessage = 'Failed to update department. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      const createPayload: CreateDepartment = {
        name: formValue.name,
        description: formValue.description || null
      };

      this.departmentService.createDepartment(createPayload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/departments']);
        },
        error: (err) => {
          console.error('Failed to create department', err);
          this.errorMessage = 'Failed to create department. Please check values.';
          this.isSubmitting = false;
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.departmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
