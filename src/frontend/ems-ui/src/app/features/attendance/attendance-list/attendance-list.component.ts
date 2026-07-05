import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService, Attendance, CreateAttendance, UpdateAttendance } from '../attendance.service';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  // States
  records: Attendance[] = [];
  employees: Employee[] = [];
  selectedEmployeeId = '';
  currentEmployee: Employee | null = null;
  isLoading = false;
  isActionLoading = false;
  errorMessage = '';
  isAdmin = false;
  remarksText = '';

  // Today's attendance state for employees
  todayRecord: Attendance | null = null;
  hasCheckedInToday = false;
  hasCheckedOutToday = false;

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
        this.loadAttendanceRecords(emp.id);
      },
      error: (err) => {
        console.error('Failed to get self profile', err);
        this.errorMessage = 'Failed to fetch your profile information.';
        this.isLoading = false;
      }
    });
  }

  onEmployeeChange(): void {
    if (!this.selectedEmployeeId) return;
    this.currentEmployee = this.employees.find(e => e.id === this.selectedEmployeeId) || null;
    this.loadAttendanceRecords(this.selectedEmployeeId);
  }

  loadAttendanceRecords(employeeId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.attendanceService.getByEmployee(employeeId).subscribe({
      next: (data) => {
        // Sort descending by date
        this.records = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.checkTodayStatus();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load attendance logs', err);
        this.errorMessage = 'Failed to load attendance records.';
        this.isLoading = false;
      }
    });
  }

  checkTodayStatus(): void {
    const todayStr = new Date().toDateString();
    this.todayRecord = this.records.find(r => new Date(r.date).toDateString() === todayStr) || null;
    this.hasCheckedInToday = !!this.todayRecord;
    this.hasCheckedOutToday = !!(this.todayRecord && this.todayRecord.checkOutTime);
  }

  onCheckIn(): void {
    if (!this.selectedEmployeeId) return;
    this.isActionLoading = true;
    this.errorMessage = '';

    // Determine status: Late if check-in is after 9:15 AM
    const now = new Date();
    const limitTime = new Date();
    limitTime.setHours(9, 15, 0, 0);
    const status = now.getTime() > limitTime.getTime() ? 'Late' : 'Present';

    const payload: CreateAttendance = {
      employeeId: this.selectedEmployeeId,
      date: now.toISOString(),
      checkInTime: now.toISOString(),
      status: status,
      remarks: this.remarksText || null
    };

    this.attendanceService.recordAttendance(payload).subscribe({
      next: () => {
        this.remarksText = '';
        this.loadAttendanceRecords(this.selectedEmployeeId);
        this.isActionLoading = false;
      },
      error: (err) => {
        console.error('Failed to check in', err);
        this.errorMessage = 'Failed to record check-in.';
        this.isActionLoading = false;
      }
    });
  }

  onCheckOut(): void {
    if (!this.todayRecord) return;
    this.isActionLoading = true;
    this.errorMessage = '';

    const now = new Date();
    const payload: UpdateAttendance = {
      checkOutTime: now.toISOString(),
      status: this.todayRecord.status, // preserve check-in status (Late/Present)
      remarks: this.remarksText || this.todayRecord.remarks
    };

    this.attendanceService.updateAttendance(this.todayRecord.id, payload).subscribe({
      next: () => {
        this.remarksText = '';
        this.loadAttendanceRecords(this.selectedEmployeeId);
        this.isActionLoading = false;
      },
      error: (err) => {
        console.error('Failed to check out', err);
        this.errorMessage = 'Failed to record check-out.';
        this.isActionLoading = false;
      }
    });
  }

  formatTime(timeStr: string | null): string {
    if (!timeStr) return '-';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present': return 'badge-success';
      case 'Late': return 'badge-warning';
      case 'Absent': return 'badge-danger';
      case 'HalfDay': return 'badge-info';
      default: return '';
    }
  }
}
