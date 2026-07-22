import {
  Component,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Resume } from '../../services/resume';
import { Ai, ResumeReview } from '../../services/ai';

@Component({
  selector: 'app-ai-suggestions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ai-suggestions.html',
  styleUrl: './ai-suggestions.css'
})
export class AiSuggestions implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private resumeService = inject(Resume);
  private aiService = inject(Ai);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  isCheckingResume = true;
  hasResume = false;

  errorMessage = '';
  review: ResumeReview | null = null;

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.checkResume();
  }

  // ==========================================
  // CHECK IF USER ALREADY HAS A RESUME
  // ==========================================

  private checkResume(): void {

    this.isCheckingResume = true;
    this.errorMessage = '';

    this.resumeService.getResumes().subscribe({

      next: (resumes) => {

        console.log('AI Suggestions - resumes found:', resumes);

        this.hasResume = Array.isArray(resumes) && resumes.length > 0;
        this.isCheckingResume = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'AI Suggestions - failed to check resume:',
          error
        );

        this.hasResume = false;
        this.isCheckingResume = false;

        this.errorMessage =
          'Could not check your resume. Please refresh and try again.';

        this.cdr.detectChanges();
      }

    });
  }

  // ==========================================
  // GET AI REVIEW
  // ==========================================

  getReview(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.review = null;

    this.resumeService.getResumes().subscribe({

      next: (resumes) => {

        console.log(
          'AI Review - resumes returned:',
          resumes
        );

        // Resume really doesn't exist
        if (!Array.isArray(resumes) || resumes.length === 0) {

          this.hasResume = false;
          this.isLoading = false;

          this.cdr.detectChanges();

          return;
        }

        this.hasResume = true;

        // Latest resume
        const resume = resumes[resumes.length - 1];

        const resumeText = `
Full Name: ${resume.fullName ?? ''}
Email: ${resume.email ?? ''}
Phone: ${resume.phone ?? ''}
GitHub: ${resume.gitHub ?? ''}
LinkedIn: ${resume.linkedIn ?? ''}
Education: ${resume.education ?? ''}
Experience: ${resume.experience ?? ''}
Skills: ${resume.skills ?? ''}
Projects: ${resume.projects ?? ''}
Certificates: ${resume.certificates ?? ''}
Languages: ${resume.languages ?? ''}
`;

        console.log(
          'Sending resume to AI review:',
          resumeText
        );

        this.aiService.reviewResume(resumeText).subscribe({

          next: (result) => {

            console.log(
              'AI review result:',
              result
            );

            this.review = result;
            this.isLoading = false;

            this.cdr.detectChanges();
          },

          error: (error) => {

            console.error(
              'AI review failed:',
              error
            );

            this.errorMessage =
              'AI review failed. Try again in a moment.';

            this.isLoading = false;

            this.cdr.detectChanges();
          }

        });
      },

      error: (error) => {

        console.error(
          'Failed to load resume for AI review:',
          error
        );

        this.errorMessage =
          'Could not load your resume. Please try again.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }
}