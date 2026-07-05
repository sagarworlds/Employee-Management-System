import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DesignationService, CreateDesignation, UpdateDesignation } from '../designation.service';

@Component({
  selector: 'app-designation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './designation-form.component.html',
  styleUrls: ['./designation-form.component.scss']
})
export class DesignationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private designationService = inject(DesignationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  designationForm!: FormGroup;
  isEditMode = false;
  designationId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initForm();

    this.designationId = this.route.snapshot.paramMap.get('id');
    if (this.designationId) {
      this.isEditMode = true;
      this.loadDesignationData(this.designationId);
    }
  }

  private initForm(): void {
    this.designationForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  private loadDesignationData(id: string): void {
    this.isLoading = true;
    this.designationService.getDesignationById(id).subscribe({
      next: (desig) => {
        this.designationForm.patchValue({
          name: desig.name,
          description: desig.description,
          isActive: desig.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load designation details', err);
        this.errorMessage = 'Failed to load designation details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formValue = this.designationForm.value;

    if (this.isEditMode && this.designationId) {
      const updatePayload: UpdateDesignation = {
        name: formValue.name,
        description: formValue.description || null,
        isActive: formValue.isActive
      };

      this.designationService.updateDesignation(this.designationId, updatePayload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/designations']);
        },
        error: (err) => {
          console.error('Failed to update designation', err);
          this.errorMessage = 'Failed to update designation. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      const createPayload: CreateDesignation = {
        name: formValue.name,
        description: formValue.description || null
      };

      this.designationService.createDesignation(createPayload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/designations']);
        },
        error: (err) => {
          console.error('Failed to create designation', err);
          this.errorMessage = 'Failed to create designation. Please check values.';
          this.isSubmitting = false;
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.designationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
