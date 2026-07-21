import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Theme {

  private platformId = inject(PLATFORM_ID);

  isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      const isDark = saved === 'dark';
      this.isDark.set(isDark);
      this.applyTheme(isDark);
    }
  }

  toggle() {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyTheme(next);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    }
  }

  private applyTheme(isDark: boolean) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}