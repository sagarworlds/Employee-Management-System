import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

export interface Designation {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface CreateDesignation {
  name: string;
  description: string | null;
}

export interface UpdateDesignation {
  name: string;
  description: string | null;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private endpoint = 'api/Designations';

  constructor(private api: ApiService) {}

  getDesignations(): Observable<Designation[]> {
    return this.api.getAll<Designation>(this.endpoint);
  }

  getDesignationById(id: string): Observable<Designation> {
    return this.api.get<Designation>(`${this.endpoint}/${id}`);
  }

  createDesignation(designation: CreateDesignation): Observable<Designation> {
    return this.api.post<Designation>(this.endpoint, designation);
  }

  updateDesignation(id: string, designation: UpdateDesignation): Observable<void> {
    return this.api.put(`${this.endpoint}/${id}`, designation);
  }

  deleteDesignation(id: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
