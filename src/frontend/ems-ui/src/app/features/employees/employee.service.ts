import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string;
  designationName: string;
  salary: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private endpoint = 'Employees';

  constructor(private api: ApiService) {}

  getEmployees(): Observable<Employee[]> {
    return this.api.getAll<Employee>(this.endpoint);
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.api.get<Employee>(`${this.endpoint}/${id}`);
  }
}
