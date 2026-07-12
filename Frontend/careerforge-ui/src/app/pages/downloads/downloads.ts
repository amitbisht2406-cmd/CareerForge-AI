import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Resume } from '../../services/resume';
import { Portfolio } from '../../services/portfolio';

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './downloads.html',
  styleUrl: './downloads.css'
})
export class Downloads implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private resumeService = inject(Resume);
  private portfolioService = inject(Portfolio);

  resumes: any[] = [];
  portfolios: any[] = [];
  isLoading = true;

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resumeService.getResumes().subscribe({
      next: (data) => {
        this.resumes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load resumes:', error);
        this.isLoading = false;
      }
    });

    this.portfolioService.getPortfolios().subscribe({
      next: (data) => {
        this.portfolios = data;
      },
      error: (error) => {
        console.error('Failed to load portfolios:', error);
      }
    });

  }

}