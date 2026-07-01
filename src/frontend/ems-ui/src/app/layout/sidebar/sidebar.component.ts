import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private authService = inject(AuthService);

  userRole: string = 'Employee';

  constructor() {
    // In a real app, we would get the role from the token via AuthService
    // For now, we can mock it or get it from localStorage
    const role = localStorage.getItem('userRole') || 'Employee';
    this.userRole = role;
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  isEmployee(): boolean {
    return this.userRole === 'Employee';
  }
}
