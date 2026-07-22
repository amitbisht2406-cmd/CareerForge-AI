import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  isPlatformBrowser,
  CommonModule
} from '@angular/common';

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

  private cdr = inject(ChangeDetectorRef);

  resumes: any[] = [];
  portfolios: any[] = [];

  isLoading = true;

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // =========================
    // LOAD RESUMES
    // =========================

    this.resumeService.getResumes().subscribe({

      next: (data) => {

        console.log('DOWNLOADS - resumes received:', data);

        this.resumes = Array.isArray(data) ? data : [];

        this.isLoading = false;

        // Force UI refresh
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'DOWNLOADS - resume API failed:',
          error
        );

        this.resumes = [];
        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });


    // =========================
    // LOAD PORTFOLIOS
    // =========================

    this.portfolioService.getPortfolios().subscribe({

      next: (data) => {

        console.log(
          'DOWNLOADS - portfolios received:',
          data
        );

        this.portfolios =
          Array.isArray(data) ? data : [];

        // Force UI refresh
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'DOWNLOADS - portfolio API failed:',
          error
        );

        this.portfolios = [];

        this.cdr.detectChanges();
      }

    });

  }
}