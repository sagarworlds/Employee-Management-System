import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h2>Departments</h2><p>Loading...</p></div>`
})
export class DepartmentListComponent {}
