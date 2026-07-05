import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-container"><h2>Leave Requests</h2><p>Loading...</p></div>`
})
export class LeaveListComponent {}
