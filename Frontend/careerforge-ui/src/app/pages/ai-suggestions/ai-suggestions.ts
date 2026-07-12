import { Component, PLATFORM_ID, inject } from '@angular/core';
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
export class AiSuggestions {

  private platformId = inject(PLATFORM_ID);
  private resumeService = inject(Resume);
  private aiService = inject(Ai);

  isLoading = false;
  hasResume = true;
  errorMessage = '';
  review: ResumeReview | null = null;

  getReview() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.review = null;

    this.resumeService.getResumes().subscribe({

      next: (resumes) => {

        if (resumes.length === 0) {
          this.hasResume = false;
          this.isLoading = false;
          return;
        }

        const resume = resumes[resumes.length - 1];

        const resumeText = `
Full Name: ${resume.fullName}
Email: ${resume.email}
Education: ${resume.education}
Experience: ${resume.experience}
Skills: ${resume.skills}
Projects: ${resume.projects}
Certificates: ${resume.certificates}
`;

        this.aiService.reviewResume(resumeText).subscribe({
          next: (result) => {
            this.review = result;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('AI review failed:', error);
            this.errorMessage = 'AI review failed. Try again in a moment.';
            this.isLoading = false;
          }
        });

      },

      error: (error) => {
        console.error('Failed to load resume:', error);
        this.isLoading = false;
      }

    });

  }

}