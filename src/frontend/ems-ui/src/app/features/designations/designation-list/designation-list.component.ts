import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DesignationService, Designation } from '../designation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.scss']
})
export class DesignationListComponent implements OnInit {
  private designationService = inject(DesignationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  designations: Designation[] = [];
  isLoading = false;
  errorMessage = '';
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.designationService.getDesignations().subscribe({
      next: (data) => {
        this.designations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching designations', err);
        this.errorMessage = 'Failed to load designations. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteDesignation(id: string): void {
    if (confirm('Are you sure you want to delete this designation? All employees holding this designation may become unassigned.')) {
      this.designationService.deleteDesignation(id).subscribe({
        next: () => {
          this.loadDesignations();
        },
        error: (err) => {
          console.error('Error deleting designation', err);
          alert('Failed to delete designation. Ensure you have administrator permissions.');
        }
      });
    }
  }

  editDesignation(id: string): void {
    this.router.navigate(['/designations', id, 'edit']);
  }
}
