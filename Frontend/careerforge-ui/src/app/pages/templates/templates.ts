import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Resume } from '../../services/resume';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './templates.html',
  styleUrl: './templates.css'
})
export class Templates implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private resumeService = inject(Resume);
  private cdr = inject(ChangeDetectorRef);

  templateOptions = [
    { id: 1, name: 'Classic' },
    { id: 2, name: 'Modern' },
    { id: 3, name: 'Minimal' },
    { id: 4, name: 'Professional' }
  ];

  currentResumeId: number | null = null;
  currentTemplateId: number | null = null;
  hasResume = false;
  message = '';

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resumeService.getResumes().subscribe({
      next: (resumes) => {
        if (resumes.length === 0) {
          this.hasResume = false;
          this.cdr.detectChanges();
          return;
        }
        const resume = resumes[resumes.length - 1];
        this.currentResumeId = resume.id;
        this.currentTemplateId = resume.templateId;
        this.hasResume = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load resume:', error);
        this.cdr.detectChanges();
      }
    });

  }

  useTemplate(templateId: number) {

    if (!this.hasResume || this.currentResumeId === null) {
      this.message = 'Create a resume first before choosing a template.';
      this.cdr.detectChanges();
      return;
    }

    this.resumeService.getResumes().subscribe({
      next: (resumes) => {

        const resume = resumes.find(r => r.id === this.currentResumeId);

        if (!resume) {
          return;
        }

        resume.templateId = templateId;

        this.resumeService.updateResume(this.currentResumeId!, resume).subscribe({
          next: () => {
            this.currentTemplateId = templateId;
            this.message = 'Template applied ✅';
            this.cdr.detectChanges();
          },
          error: () => {
            this.message = 'Failed to apply template ❌';
            this.cdr.detectChanges();
          }
        });

      }
    });

  }

}