import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Resume } from '../../services/resume';
import { Portfolio } from '../../services/portfolio';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private resumeService = inject(Resume);
  private portfolioService = inject(Portfolio);

  fullName = typeof window !== 'undefined' ? localStorage.getItem('fullName') : '';

  hasResume = false;
  hasPortfolio = false;

  get completionPercent(): number {
    const done = [this.hasResume, this.hasPortfolio].filter(Boolean).length;
    return Math.round((done / 2) * 100);
  }

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resumeService.getResumes().subscribe({
      next: (resumes) => this.hasResume = resumes.length > 0,
      error: () => {}
    });

    this.portfolioService.getPortfolios().subscribe({
      next: (portfolios) => this.hasPortfolio = portfolios.length > 0,
      error: () => {}
    });

  }

}