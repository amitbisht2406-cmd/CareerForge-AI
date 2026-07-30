import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Portfolio } from '../../services/portfolio';
import { Resume } from '../../services/resume';

@Component({
  selector: 'app-portfolio-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio-view.html',
  styleUrl: './portfolio-view.css'
})
export class PortfolioView implements OnInit {

  private route = inject(ActivatedRoute);
  private portfolioService = inject(Portfolio);
  private resumeService = inject(Resume);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  portfolio: any = null;
  resume: any = null;

  skills: string[] = [];
  projects: any[] = [];
  certificates: any[] = [];
  languages: any[] = [];
  achievements: string[] = [];

  isLoading = true;
  notFound = false;

  ngOnInit(): void {

    // Don't fetch during SSR — see earlier fix note: avoids
    // self-signed cert failures and keeps this simple and safe
    // regardless of environment.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    this.portfolioService.getPublicPortfolio(id).subscribe({

      next: (data) => {

        this.portfolio = data;
        this.skills = this.safeParseArray(data.skills);
        this.projects = this.safeParseArray(data.projects);

        if (data.resumeId) {
          this.loadLinkedResume(data.resumeId);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },

      error: (error) => {
        console.error('Failed to load public portfolio:', error);
        this.isLoading = false;
        this.notFound = true;
        this.cdr.detectChanges();
      }

    });
  }

  private loadLinkedResume(resumeId: number): void {

    this.resumeService.getPublicResume(resumeId).subscribe({

      next: (resumeData) => {

        this.resume = resumeData;
        this.certificates = this.safeParseArray(resumeData.certificates);
        this.languages = this.safeParseArray(resumeData.languages);
        this.achievements = this.safeParseArray(resumeData.achievements);

        // If the portfolio's own Skills list is empty, fall back to
        // the linked resume's skills so the page isn't sparse.
        if (this.skills.length === 0) {
          this.skills = this.safeParseArray(resumeData.skills);
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        // Non-fatal — the portfolio itself still loaded fine,
        // we just won't show the resume-derived sections.
        console.error('Failed to load linked resume:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }

    });
  }

  private safeParseArray(raw: string | null | undefined): any[] {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  get initials(): string {
    const name = this.portfolio?.heroTitle || '';
    if (!name) {
      return '?';
    }
    return name
      .trim()
      .split(/\s+/)
      .map((part: string) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get hasEducationOrExperience(): boolean {
    return !!(this.resume?.education || this.resume?.experience);
  }

  scrollTo(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  downloadResume(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }
}
