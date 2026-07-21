import {
  AfterViewInit,
  Component,
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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

import { gsap } from 'gsap';


/* =========================================================
   PASSWORD MATCH VALIDATOR
   ========================================================= */

function passwordsMatchValidator(): ValidatorFn {

  return (
    group: AbstractControl
  ): ValidationErrors | null => {

    const password =
      group.get('password')?.value;

    const confirmPassword =
      group.get('confirmPassword')?.value;


    return password === confirmPassword
      ? null
      : { passwordsMismatch: true };

  };

}


/* =========================================================
   COMPONENT
   ========================================================= */

@Component({

  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrl: './register.css'

})

export class Register implements AfterViewInit {


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



  /* =======================================================
     UI STATE
     ======================================================= */

  errorMessage = '';

  isLoading = false;


  showPassword = false;

  showConfirmPassword = false;



  /* =======================================================
     REGISTER FORM
     ======================================================= */

  registerForm = this.fb.group(

    {

      fullName: [
        '',
        Validators.required
      ],


      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],


      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],


      confirmPassword: [
        '',
        Validators.required
      ]

    },

    {
      validators:
        passwordsMatchValidator()
    }

  );



  /* =======================================================
     PASSWORD VISIBILITY
     ======================================================= */

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }



  /* =======================================================
     SUBMIT REGISTER FORM
     ======================================================= */

  onSubmit(): void {


    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }


    this.isLoading = true;

    this.errorMessage = '';


    const {
      confirmPassword,
      ...payload
    } = this.registerForm.value;



    this.authService
      .register(payload as any)
      .subscribe({


        /* ================= SUCCESS ================= */

        next: () => {

          this.isLoading = false;

          this.router.navigate([
            '/login'
          ]);

        },


        /* ================= ERROR ================= */

        error: (err) => {

          this.isLoading = false;


          this.errorMessage =
            extractErrorMessage(
              err,
              'Registration failed. Try again.'
            );

        }

      });

  }



  /* =======================================================
     GSAP UI ANIMATIONS
     ======================================================= */

  ngAfterViewInit(): void {


    /*
     * Angular SSR/Vite ke time GSAP ko DOM access
     * nahi dena.
     */

    if (
      !isPlatformBrowser(this.platformId)
    ) {

      return;

    }



    /* ================= LEFT BRAND ================= */

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



    /* ================= REGISTER FORM ================= */

    gsap.from(
      [
        '.form-badge',
        '.form-heading',
        '.form-group',
        '.create-account-btn',
        '.form-divider',
        '.login-link',
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