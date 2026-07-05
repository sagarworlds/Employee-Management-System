import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string; // Present, Absent, Late, HalfDay
  remarks: string | null;
  employeeName?: string;
}

export interface CreateAttendance {
  employeeId: string;
  date: string;
  checkInTime: string;
  status: string;
  remarks: string | null;
}

export interface UpdateAttendance {
  checkOutTime: string | null;
  status: string;
  remarks: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private endpoint = 'api/Attendance';

  constructor(private api: ApiService) {}

  getByEmployee(employeeId: string): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(`${this.endpoint}/employee/${employeeId}`);
  }

  recordAttendance(attendance: CreateAttendance): Observable<Attendance> {
    return this.api.post<Attendance>(this.endpoint, attendance);
  }

  updateAttendance(id: string, attendance: UpdateAttendance): Observable<void> {
    return this.api.put(`${this.endpoint}/${id}`, attendance);
  }
}
