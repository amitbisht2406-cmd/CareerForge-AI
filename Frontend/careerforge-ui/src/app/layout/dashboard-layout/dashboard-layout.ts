import {
  Component,
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  Theme
} from '../../services/theme';

import {
  Notifications
} from '../../services/notifications';


@Component({

  selector:
    'app-dashboard-layout',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],

  templateUrl:
    './dashboard-layout.html',

  styleUrl:
    './dashboard-layout.css'

})

export class DashboardLayout {


  /* =======================================================
     DEPENDENCIES
     ======================================================= */

  private router =
    inject(Router);


  private platformId =
    inject(PLATFORM_ID);


  theme =
    inject(Theme);


  notifications =
    inject(Notifications);



  /* =======================================================
     UI STATE
     ======================================================= */

  showNotifications =
    false;


  fullName =
    isPlatformBrowser(this.platformId)
      ? localStorage.getItem('fullName') || ''
      : '';



  /* =======================================================
     NAVIGATION
     ======================================================= */

  navItems = [

    {
      label: 'Dashboard',
      icon: '⌂',
      link: '/dashboard'
    },

    {
      label: 'Resume Builder',
      icon: '▤',
      link: '/resume-builder'
    },

    {
      label: 'Portfolio',
      icon: '◇',
      link: '/portfolio-builder'
    },

    {
      label: 'Templates',
      icon: '▦',
      link: '/templates'
    },

    {
      label: 'AI Suggestions',
      icon: '✦',
      link: '/ai-suggestions'
    },

    {
      label: 'Downloads',
      icon: '↓',
      link: '/downloads'
    },

    {
      label: 'Settings',
      icon: '⚙',
      link: '/settings'
    }

  ];



  /* =======================================================
     USER INITIALS
     ======================================================= */

  get initials(): string {


    if (!this.fullName) {

      return '?';

    }


    return this.fullName

      .trim()

      .split(/\s+/)

      .map(
        part =>
          part[0]
      )

      .slice(
        0,
        2
      )

      .join('')

      .toUpperCase();

  }



  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  toggleNotifications(): void {


    this.showNotifications =
      !this.showNotifications;


    if (
      this.showNotifications
    ) {

      this.notifications
        .markAllRead();

    }

  }



  /* =======================================================
     LOGOUT
     ======================================================= */

  logout(): void {


    if (
      isPlatformBrowser(this.platformId)
    ) {

      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'fullName'
      );

    }


    this.router.navigate([
      '/login'
    ]);

  }

}