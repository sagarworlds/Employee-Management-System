import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h2>Attendance Tracking</h2><p>Loading...</p></div>`
})
export class AttendanceListComponent {}
