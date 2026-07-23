import {
  AfterViewInit,
   ChangeDetectorRef,
  Component,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  Resume
} from '../../services/resume';

import {
  Portfolio
} from '../../services/portfolio';

import {
  gsap
} from 'gsap';


@Component({

  selector:
    'app-dashboard',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './dashboard.html',

  styleUrl:
    './dashboard.css'

})

export class Dashboard
  implements OnInit, AfterViewInit {


  /* =======================================================
     DEPENDENCIES
     ======================================================= */
private cdr = inject(ChangeDetectorRef);
  private platformId =
    inject(PLATFORM_ID);


  private resumeService =
    inject(Resume);


  private portfolioService =
    inject(Portfolio);



  /* =======================================================
     USER
     ======================================================= */

  fullName =
    isPlatformBrowser(this.platformId)
      ? localStorage.getItem('fullName') || ''
      : '';



  /* =======================================================
     PROFILE STATE
     ======================================================= */

  hasResume =
    false;


  hasPortfolio =
    false;



  /* =======================================================
     COMPLETION
     ======================================================= */

  get completionPercent(): number {


    const completedItems = [

      this.hasResume,

      this.hasPortfolio

    ].filter(Boolean).length;


    return Math.round(

      (
        completedItems /
        2
      ) * 100

    );

  }



  /* =======================================================
     LOAD DASHBOARD DATA
     ======================================================= */

  ngOnInit(): void {


    if (
      !isPlatformBrowser(this.platformId)
    ) {

      return;

    }



    /* ================= RESUMES ================= */

    this.resumeService.getResumes().subscribe({
  next: (resumes) => {
    this.hasResume = resumes.length > 0;
    this.cdr.detectChanges();
  },

  error: (error) => {
    console.error('Failed to load dashboard resumes:', error);
    this.hasResume = false;
    this.cdr.detectChanges();
  }
});



    /* ================= PORTFOLIOS ================= */

  this.portfolioService.getPortfolios().subscribe({
  next: (portfolios) => {
    this.hasPortfolio = portfolios.length > 0;
    this.cdr.detectChanges();
  },

  error: (error) => {
    console.error('Failed to load dashboard portfolios:', error);
    this.hasPortfolio = false;
    this.cdr.detectChanges();
  }
});

  }



  /* =======================================================
     DASHBOARD ANIMATIONS
     ======================================================= */

  ngAfterViewInit(): void {


    /*
     * Important:
     * Prevent GSAP DOM access during Angular SSR.
     */

    if (
      !isPlatformBrowser(this.platformId)
    ) {

      return;

    }



    /* ================= HEADER ================= */

    gsap.from(
      [
        '.welcome-badge',
        '.welcome h1',
        '.welcome p',
        '.header-actions'
      ],
      {

        y: 20,

        opacity: 0,

        duration: 0.65,

        stagger: 0.08,

        ease: 'power3.out'

      }
    );



    /* ================= PROGRESS ================= */

    gsap.from(
      '.progress-card',
      {

        y: 25,

        opacity: 0,

        scale: 0.985,

        duration: 0.75,

        delay: 0.15,

        ease: 'power3.out'

      }
    );



    /* ================= TOOL CARDS ================= */

    gsap.from(
      '.tool-card',
      {

        y: 28,

        opacity: 0,

        duration: 0.65,

        stagger: 0.09,

        delay: 0.25,

        ease: 'power3.out'

      }
    );



    /* ================= LOWER PANELS ================= */

    gsap.from(
      [
        '.quick-panel',
        '.status-panel'
      ],
      {

        y: 25,

        opacity: 0,

        duration: 0.7,

        stagger: 0.12,

        delay: 0.45,

        ease: 'power3.out'

      }
    );

  }

}