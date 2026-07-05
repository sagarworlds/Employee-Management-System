import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string; // Sick, Casual, Earned, etc.
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string; // Pending, Approved, Rejected
  approvedByUserId: string | null;
  approvalDate: string | null;
  employeeName?: string;
}

export interface CreateLeaveRequest {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
}

export interface UpdateLeaveStatus {
  status: string; // Approved, Rejected
  approvedByUserId: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private endpoint = 'api/LeaveRequests';

  constructor(private api: ApiService) {}

  getByEmployee(employeeId: string): Observable<LeaveRequest[]> {
    return this.api.get<LeaveRequest[]>(`${this.endpoint}/employee/${employeeId}`);
  }

  applyLeave(leave: CreateLeaveRequest): Observable<LeaveRequest> {
    return this.api.post<LeaveRequest>(this.endpoint, leave);
  }

  updateLeaveStatus(id: string, payload: UpdateLeaveStatus): Observable<void> {
    return this.api.put(`${this.endpoint}/${id}/status`, payload);
  }

  deleteLeave(id: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
