import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Department {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface CreateDepartment {
  name: string;
  description: string | null;
}

export interface UpdateDepartment {
  name: string;
  description: string | null;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private endpoint = 'api/Departments';

  constructor(private api: ApiService) {}

  getDepartments(): Observable<Department[]> {
    return this.api.getAll<Department>(this.endpoint);
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.api.get<Department>(`${this.endpoint}/${id}`);
  }

  createDepartment(department: CreateDepartment): Observable<Department> {
    return this.api.post<Department>(this.endpoint, department);
  }

  updateDepartment(id: string, department: UpdateDepartment): Observable<void> {
    return this.api.put(`${this.endpoint}/${id}`, department);
  }

  deleteDepartment(id: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
