import {
  AfterViewInit,
  Component,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { Auth } from '../../services/auth';

import {
  extractErrorMessage
} from '../../shared/error-message.util';

import { environment } from '../../../environments/environment';

import { gsap } from 'gsap';


@Component({

  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'

})

export class Login implements AfterViewInit {


  /* =======================================================
     DEPENDENCIES
     ======================================================= */

  private fb =
    inject(FormBuilder);


  private authService =
    inject(Auth);


  private router =
    inject(Router);


  private platformId =
    inject(PLATFORM_ID);

  private cdr =
    inject(ChangeDetectorRef);



  /* =======================================================
     UI STATE
     ======================================================= */

  errorMessage = '';

  isLoading = false;

  showPassword = false;



  /* =======================================================
     LOGIN FORM
     ======================================================= */

  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],


    password: [
      '',
      Validators.required
    ]

  });



  /* =======================================================
     PASSWORD VISIBILITY
     ======================================================= */

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }



  /* =======================================================
     FORGOT PASSWORD
     ======================================================= */

  onForgotPassword(): void {

    /*
     * Forgot-password page/API jab banayenge,
     * tab yahan routing add kar sakte hain.
     */

    console.log(
      'Forgot password clicked'
    );

  }



  /* =======================================================
     LOGIN
     ======================================================= */

  onSubmit(): void {

  if (this.loginForm.invalid) {

    this.loginForm.markAllAsTouched();

    return;

  }

  this.isLoading = true;
  this.errorMessage = '';

  const payload = {

    email: this.loginForm.value.email!,

    password: this.loginForm.value.password!

  };

  this.authService
    .login(payload)
    .subscribe({

      next: () => {

        this.isLoading = false;

        this.router.navigate(['/dashboard']);

      },

      error: (err) => {

        this.isLoading = false;

        this.errorMessage =
          extractErrorMessage(
            err,
            'Invalid email or password.'
          );

        this.cdr.detectChanges();

      }

    });

}


        /* ================= SUCCESS ================= */

       

          /*
           * If your Auth service already stores the token,
           * nothing else is required here.
           */


         



  /* =======================================================
     GOOGLE SIGN-IN
     ======================================================= */

  private initGoogleSignIn(): void {

    if (!window.google) {

      // Script may still be loading (it's async/defer); retry shortly.
      setTimeout(() => this.initGoogleSignIn(), 300);
      return;

    }

    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => this.handleGoogleCredential(response.credential)
    });

    const container = document.getElementById('google-signin-button');

    if (container) {

      window.google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 320
      });

    }

  }


  private handleGoogleCredential(idToken: string): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .googleLogin(idToken)
      .subscribe({

        next: () => {

          this.isLoading = false;

          this.router.navigate(['/dashboard']);

        },

        error: (err) => {

          this.isLoading = false;

          this.errorMessage =
            extractErrorMessage(
              err,
              'Google sign-in failed. Please try again.'
            );

          this.cdr.detectChanges();

        }

      });

  }



  /* =======================================================
     GSAP
     ======================================================= */

  ngAfterViewInit(): void {


    /*
     * Prevent GSAP from running during SSR.
     */

    if (
      !isPlatformBrowser(this.platformId)
    ) {

      return;

    }

    this.initGoogleSignIn();



    /* ================= BRAND ================= */

    gsap.from(
      '.auth-brand',
      {

        x: -25,

        opacity: 0,

        duration: 0.7,

        delay: 0.15,

        ease: 'power3.out'

      }
    );



    /* ================= LEFT CONTENT ================= */

    gsap.from(
      [
        '.showcase-badge',
        '.showcase-title',
        '.showcase-description'
      ],
      {

        x: -35,

        opacity: 0,

        duration: 0.8,

        stagger: 0.12,

        delay: 0.25,

        ease: 'power3.out'

      }
    );



    /* ================= BENEFITS ================= */

    gsap.from(
      '.benefit-item',
      {

        x: -25,

        opacity: 0,

        duration: 0.65,

        stagger: 0.1,

        delay: 0.55,

        ease: 'power3.out'

      }
    );



    /* ================= MINI CARDS ================= */

    gsap.from(
      '.mini-card',
      {

        y: 20,

        scale: 0.9,

        opacity: 0,

        duration: 0.7,

        stagger: 0.12,

        delay: 0.85,

        ease: 'back.out(1.5)'

      }
    );



    /* ================= LOGIN FORM ================= */

    gsap.from(
      [
        '.form-badge',
        '.form-heading',
        '.form-group',
        '.login-btn',
        '.form-divider',
        '.register-link',
        '.security-note'
      ],
      {

        y: 22,

        opacity: 0,

        duration: 0.65,

        stagger: 0.07,

        delay: 0.25,

        ease: 'power3.out'

      }
    );

  }

}