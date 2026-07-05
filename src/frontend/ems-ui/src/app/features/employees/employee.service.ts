import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  dateOfJoining: string;
  departmentId: string;
  designationId: string;
  salary: number;
  address: string | null;
  status: string;
  isActive: boolean;
  departmentName: string;
  designationName: string;
}

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  dateOfJoining: string;
  departmentId: string;
  designationId: string;
  salary: number;
  address: string | null;
  applicationUserId?: string | null;
}

export interface UpdateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  dateOfJoining: string;
  departmentId: string;
  designationId: string;
  salary: number;
  address: string | null;
  status: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private endpoint = 'api/Employees';

  constructor(private api: ApiService) {}

  getEmployees(): Observable<Employee[]> {
    return this.api.getAll<Employee>(this.endpoint);
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.api.get<Employee>(`${this.endpoint}/${id}`);
  }

  createEmployee(employee: CreateEmployee): Observable<Employee> {
    return this.api.post<Employee>(this.endpoint, employee);
  }

  updateEmployee(id: string, employee: UpdateEmployee): Observable<void> {
    return this.api.put(`${this.endpoint}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }

  getMe(): Observable<Employee> {
    return this.api.get<Employee>('api/Employee/me');
  }
}
