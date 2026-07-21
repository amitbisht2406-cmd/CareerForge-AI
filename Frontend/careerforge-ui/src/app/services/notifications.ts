import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppNotification {
  id: number;
  message: string;
  icon: string;
  timestamp: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Notifications {

  private platformId = inject(PLATFORM_ID);
  private storageKey = 'notifications';

  items = signal<AppNotification[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          this.items.set(JSON.parse(saved));
        } catch {
          this.items.set([]);
        }
      }
    }
  }

  get unreadCount(): number {
    return this.items().filter(n => !n.read).length;
  }

  add(message: string, icon: string = '🔔') {
    const notification: AppNotification = {
      id: Date.now(),
      message,
      icon,
      timestamp: Date.now(),
      read: false
    };

    this.items.set([notification, ...this.items()].slice(0, 20));
    this.persist();
  }

  markAllRead() {
    this.items.set(this.items().map(n => ({ ...n, read: true })));
    this.persist();
  }

  private persist() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items()));
    }
  }

}