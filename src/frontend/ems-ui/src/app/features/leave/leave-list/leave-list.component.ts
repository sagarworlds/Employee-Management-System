import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LeaveService, LeaveRequest, UpdateLeaveStatus } from '../leave.service';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  private leaveService = inject(LeaveService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  // States
  records: LeaveRequest[] = [];
  employees: Employee[] = [];
  selectedEmployeeId = '';
  currentEmployee: Employee | null = null;
  isLoading = false;
  isActionLoading = false;
  errorMessage = '';
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.loadAllEmployees();
    } else {
      this.loadSelfEmployee();
    }
  }

  loadAllEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        if (data.length > 0) {
          this.selectedEmployeeId = data[0].id;
          this.onEmployeeChange();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.errorMessage = 'Failed to load employee list.';
        this.isLoading = false;
      }
    });
  }

  loadSelfEmployee(): void {
    this.isLoading = true;
    this.employeeService.getMe().subscribe({
      next: (emp) => {
        this.currentEmployee = emp;
        this.selectedEmployeeId = emp.id;
        this.loadLeaveRecords(emp.id);
      },
      error: (err) => {
        console.error('Failed to load self profile', err);
        this.errorMessage = 'Failed to fetch your profile information.';
        this.isLoading = false;
      }
    });
  }

  onEmployeeChange(): void {
    if (!this.selectedEmployeeId) return;
    this.currentEmployee = this.employees.find(e => e.id === this.selectedEmployeeId) || null;
    this.loadLeaveRecords(this.selectedEmployeeId);
  }

  loadLeaveRecords(employeeId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.leaveService.getByEmployee(employeeId).subscribe({
      next: (data) => {
        this.records = data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load leave history', err);
        this.errorMessage = 'Failed to load leave records.';
        this.isLoading = false;
      }
    });
  }

  approveLeave(id: string): void {
    this.updateStatus(id, 'Approved');
  }

  rejectLeave(id: string): void {
    this.updateStatus(id, 'Rejected');
  }

  private updateStatus(id: string, status: 'Approved' | 'Rejected'): void {
    const adminUserId = this.authService.getUserId();
    if (!adminUserId) {
      alert('Authentication error: Unable to determine your administrator ID.');
      return;
    }

    this.isActionLoading = true;
    const payload: UpdateLeaveStatus = {
      status,
      approvedByUserId: adminUserId
    };

    this.leaveService.updateLeaveStatus(id, payload).subscribe({
      next: () => {
        this.loadLeaveRecords(this.selectedEmployeeId);
        this.isActionLoading = false;
      },
      error: (err) => {
        console.error('Failed to update leave status', err);
        alert('Failed to update leave status.');
        this.isActionLoading = false;
      }
    });
  }

  deleteLeave(id: string): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.isActionLoading = true;
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          this.loadLeaveRecords(this.selectedEmployeeId);
          this.isActionLoading = false;
        },
        error: (err) => {
          console.error('Failed to delete leave request', err);
          alert('Failed to cancel leave request.');
          this.isActionLoading = false;
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      case 'Pending': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}
