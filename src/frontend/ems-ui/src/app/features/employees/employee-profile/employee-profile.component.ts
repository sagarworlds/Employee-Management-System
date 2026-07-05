import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h2>My Profile</h2><p>Loading...</p></div>`
})
export class EmployeeProfileComponent {}
