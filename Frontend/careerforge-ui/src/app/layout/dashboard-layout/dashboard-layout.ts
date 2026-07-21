import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Theme } from '../../services/theme';
import { Notifications } from '../../services/notifications';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {

  private router = inject(Router);
  theme = inject(Theme);
  notifications = inject(Notifications);

  showNotifications = false;

  fullName = typeof window !== 'undefined' ? localStorage.getItem('fullName') : '';

  navItems = [
    { label: 'Dashboard', icon: '🏠', link: '/dashboard' },
    { label: 'Resume Builder', icon: '📄', link: '/resume-builder' },
    { label: 'Portfolio', icon: '🌐', link: '/portfolio-builder' },
    { label: 'Templates', icon: '🗂️', link: '/templates' },
    { label: 'AI Suggestions', icon: '🤖', link: '/ai-suggestions' },
    { label: 'Downloads', icon: '⬇️', link: '/downloads' },
    { label: 'Settings', icon: '⚙️', link: '/settings' }
  ];

  get initials(): string {
    if (!this.fullName) return '?';
    return this.fullName
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notifications.markAllRead();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    this.router.navigate(['/login']);
  }
}