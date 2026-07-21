import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  gsap
} from 'gsap';

import {
  ScrollTrigger
} from 'gsap/ScrollTrigger';


@Component({
  selector: 'app-landing',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './landing.html',

  styleUrl: './landing.css'
})

export class Landing implements AfterViewInit {


  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {}


  ngAfterViewInit(): void {


    /* =====================================================
       IMPORTANT: RUN GSAP ONLY IN BROWSER
       ===================================================== */

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }


    /* =====================================================
       REGISTER SCROLLTRIGGER
       ===================================================== */

    gsap.registerPlugin(ScrollTrigger);


    /* =====================================================
       NAVBAR INTRO
       ===================================================== */

    gsap.from('.landing-nav', {

      y: -40,

      opacity: 0,

      duration: 0.8,

      ease: 'power3.out'

    });


    /* =====================================================
       HERO CONTENT INTRO
       ===================================================== */

    gsap.from(
      [
        '.hero-badge',
        '.hero-title',
        '.hero-description',
        '.hero-buttons',
        '.hero-trust'
      ],
      {

        y: 45,

        opacity: 0,

        duration: 0.9,

        stagger: 0.12,

        delay: 0.15,

        ease: 'power3.out'

      }
    );


    /* =====================================================
       PRODUCT DASHBOARD INTRO
       ===================================================== */

    gsap.from('.product-preview', {

      x: 70,

      opacity: 0,

      scale: 0.92,

      duration: 1.1,

      delay: 0.35,

      ease: 'power3.out'

    });


    /* =====================================================
       FLOATING HERO CARDS
       ===================================================== */

    gsap.from('.floating-card', {

      opacity: 0,

      scale: 0.7,

      y: 30,

      duration: 0.8,

      stagger: 0.15,

      delay: 0.9,

      ease: 'back.out(1.7)'

    });


    /* =====================================================
       FEATURES SECTION HEADING
       ===================================================== */

    gsap.from('.features-section .section-heading', {

      scrollTrigger: {

        trigger: '.features-section',

        start: 'top 78%',

        toggleActions: 'play none none none'

      },

      y: 55,

      opacity: 0,

      duration: 0.9,

      ease: 'power3.out'

    });


    /* =====================================================
       BENTO FEATURE CARDS
       ===================================================== */

    gsap.from('.bento-card', {

      scrollTrigger: {

        trigger: '.bento-grid',

        start: 'top 78%',

        toggleActions: 'play none none none'

      },

      y: 70,

      opacity: 0,

      scale: 0.96,

      duration: 0.9,

      stagger: 0.12,

      ease: 'power3.out'

    });


    /* =====================================================
       AI SCORE PROGRESS
       ===================================================== */

    gsap.fromTo(
      '.score-fill',

      {
        width: '0%'
      },

      {

        width: '96%',

        duration: 1.5,

        ease: 'power3.out',

        scrollTrigger: {

          trigger: '.ai-feature',

          start: 'top 75%',

          toggleActions: 'play none none none'

        }

      }
    );


    /* =====================================================
       STATS SECTION
       ===================================================== */

    gsap.from('.stat-item', {

      scrollTrigger: {

        trigger: '.stats-section',

        start: 'top 85%',

        toggleActions: 'play none none none'

      },

      y: 30,

      opacity: 0,

      duration: 0.7,

      stagger: 0.12,

      ease: 'power2.out'

    });


    /* =====================================================
       STAT DIVIDERS
       ===================================================== */

    gsap.from('.stat-divider', {

      scrollTrigger: {

        trigger: '.stats-section',

        start: 'top 85%',

        toggleActions: 'play none none none'

      },

      scaleY: 0,

      opacity: 0,

      duration: 0.7,

      stagger: 0.1,

      transformOrigin: 'center',

      ease: 'power2.out'

    });


    /* =====================================================
       HOW IT WORKS HEADING
       ===================================================== */

    gsap.from('.how-section .section-heading', {

      scrollTrigger: {

        trigger: '.how-section',

        start: 'top 78%',

        toggleActions: 'play none none none'

      },

      y: 50,

      opacity: 0,

      duration: 0.9,

      ease: 'power3.out'

    });


    /* =====================================================
       HOW IT WORKS CARDS
       ===================================================== */

    gsap.from('.step-card', {

      scrollTrigger: {

        trigger: '.steps-grid',

        start: 'top 78%',

        toggleActions: 'play none none none'

      },

      y: 60,

      opacity: 0,

      scale: 0.96,

      duration: 0.85,

      stagger: 0.18,

      ease: 'power3.out'

    });


    /* =====================================================
       STEP ARROWS
       ===================================================== */

    gsap.from('.step-arrow', {

      scrollTrigger: {

        trigger: '.steps-grid',

        start: 'top 78%',

        toggleActions: 'play none none none'

      },

      x: -15,

      opacity: 0,

      duration: 0.6,

      delay: 0.35,

      stagger: 0.2,

      ease: 'power2.out'

    });


    /* =====================================================
       REFRESH SCROLLTRIGGER
       ===================================================== */
/* =====================================================
   AI SHOWCASE HEADING
   ===================================================== */

gsap.from('.ai-showcase-heading', {

  scrollTrigger: {

    trigger: '.ai-showcase-section',

    start: 'top 75%',

    toggleActions: 'play none none none'

  },

  y: 55,

  opacity: 0,

  duration: 0.9,

  ease: 'power3.out'

});


/* =====================================================
   AI WORKSPACE
   ===================================================== */

gsap.from('.ai-workspace', {

  scrollTrigger: {

    trigger: '.ai-workspace',

    start: 'top 80%',

    toggleActions: 'play none none none'

  },

  y: 70,

  opacity: 0,

  scale: 0.97,

  duration: 1,

  ease: 'power3.out'

});


/* =====================================================
   AI RESULT CARDS
   ===================================================== */

gsap.from('.ai-result-card', {

  scrollTrigger: {

    trigger: '.ai-results-panel',

    start: 'top 75%',

    toggleActions: 'play none none none'

  },

  x: 35,

  opacity: 0,

  duration: 0.7,

  stagger: 0.15,

  delay: 0.25,

  ease: 'power3.out'

});


/* =====================================================
   ATS PROGRESS
   ===================================================== */

gsap.fromTo(

  '.ai-result-progress-fill',

  {
    width: '0%'
  },

  {

    width: '96%',

    duration: 1.5,

    ease: 'power3.out',

    scrollTrigger: {

      trigger: '.ats-result-card',

      start: 'top 80%',

      toggleActions: 'play none none none'

    }

  }

);


/* =====================================================
   AI CAPABILITIES
   ===================================================== */

gsap.from('.ai-capability-card', {

  scrollTrigger: {

    trigger: '.ai-capabilities',

    start: 'top 88%',

    toggleActions: 'play none none none'

  },

  y: 30,

  opacity: 0,

  duration: 0.65,

  stagger: 0.1,

  ease: 'power2.out'

});
/* =====================================================
   FINAL CTA
   ===================================================== */

gsap.from('.final-cta-card', {

  scrollTrigger: {

    trigger: '.final-cta-section',

    start: 'top 78%',

    toggleActions: 'play none none none'

  },

  y: 70,

  opacity: 0,

  scale: 0.96,

  duration: 1,

  ease: 'power3.out'

});


/* =====================================================
   CTA CONTENT
   ===================================================== */

gsap.from(
  [
    '.cta-badge',
    '.final-cta-card h2',
    '.final-cta-card > p',
    '.cta-actions',
    '.cta-trust-row'
  ],
  {

    scrollTrigger: {

      trigger: '.final-cta-card',

      start: 'top 72%',

      toggleActions: 'play none none none'

    },

    y: 35,

    opacity: 0,

    duration: 0.8,

    stagger: 0.1,

    delay: 0.2,

    ease: 'power3.out'

  }
);


/* =====================================================
   FOOTER
   ===================================================== */

gsap.from('.footer-brand-column', {

  scrollTrigger: {

    trigger: '.careerforge-footer',

    start: 'top 90%',

    toggleActions: 'play none none none'

  },

  y: 30,

  opacity: 0,

  duration: 0.8,

  ease: 'power3.out'

});


gsap.from('.footer-links-column', {

  scrollTrigger: {

    trigger: '.careerforge-footer',

    start: 'top 88%',

    toggleActions: 'play none none none'

  },

  y: 30,

  opacity: 0,

  duration: 0.7,

  stagger: 0.1,

  ease: 'power3.out'

});
    ScrollTrigger.refresh();

  }

}