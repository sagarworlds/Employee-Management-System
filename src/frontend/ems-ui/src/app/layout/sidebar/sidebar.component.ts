import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  userRole: string = 'Employee';

  constructor() {
    const role = this.authService.getRole() || 'Employee';
    this.userRole = role;
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  isEmployee(): boolean {
    return this.userRole === 'Employee';
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
