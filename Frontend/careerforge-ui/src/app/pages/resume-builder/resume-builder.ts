import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Resume } from '../../services/resume';

import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';

import { ResumePersonal } from './components/resume-personal/resume-personal.component';
import { ResumeEducation } from './components/resume-education/resume-education.component';
import { ResumeSkills } from './components/resume-skills/resume-skills.component';
import { ResumeProjects } from './components/resume-projects/resume-projects.component';
import { ResumeCertificatesLanguages } from './components/resume-certificates-languages/resume-certificates-languages.component';
import { ResumePreview } from './components/resume-preview/resume-preview.component';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResumePersonal,
    ResumeEducation,
    ResumeSkills,
    ResumeProjects,
    ResumeCertificatesLanguages,
    ResumePreview
  ],
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.css'
})
export class ResumeBuilder implements OnInit {

  currentResumeId: number | null = null;

  private platformId = inject(PLATFORM_ID);

  constructor(private resumeService: Resume) {}

  resumeForm = new FormGroup({

    personalInfo: new FormGroup({

      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),

      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      }),

      github: new FormControl('', {
        nonNullable: true,
        validators: [Validators.pattern(/^https?:\/\/(www\.)?github\.com\/.+$/)]
      }),

      linkedin: new FormControl('', {
        nonNullable: true,
        validators: [Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.+$/)]
      })

    }),

    background: new FormGroup({

      education: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),

      experience: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(20)]
      })

    }),

    skills: new FormArray([
      new FormControl('', { nonNullable: true })
    ]),

    projects: new FormArray([
      new FormGroup({
        title: new FormControl('', { nonNullable: true }),
        description: new FormControl('', { nonNullable: true }),
        technologies: new FormControl('', { nonNullable: true })
      })
    ]),

    certificates: new FormArray([
      new FormGroup({
        name: new FormControl('', { nonNullable: true }),
        issuer: new FormControl('', { nonNullable: true })
      })
    ]),

    languages: new FormArray([
      new FormGroup({
        name: new FormControl('', { nonNullable: true }),
        proficiency: new FormControl('', { nonNullable: true })
      })
    ])

  });

  get personalInfo(): FormGroup {
    return this.resumeForm.get('personalInfo') as FormGroup;
  }

  get background(): FormGroup {
    return this.resumeForm.get('background') as FormGroup;
  }

  get skills(): FormArray {
    return this.resumeForm.get('skills') as FormArray;
  }

  get projects(): FormArray {
    return this.resumeForm.get('projects') as FormArray;
  }

  get certificates(): FormArray {
    return this.resumeForm.get('certificates') as FormArray;
  }

  get languages(): FormArray {
    return this.resumeForm.get('languages') as FormArray;
  }

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resumeService.getResumes().subscribe({

      next: (resumes) => {

        if (resumes.length === 0) {
          console.log('No resume found in database');
          return;
        }

        const resumeData = resumes[resumes.length - 1];
        this.currentResumeId = resumeData.id;

        console.log('Loading resume from database:', resumeData);

        this.personalInfo.patchValue({
          fullName: resumeData.fullName,
          email: resumeData.email,
          phone: resumeData.phone,
          github: resumeData.gitHub,
          linkedin: resumeData.linkedIn
        });

        this.background.patchValue({
          education: resumeData.education,
          experience: resumeData.experience
        });

        const savedSkills = this.safeParseArray(resumeData.skills);
        const savedProjects = this.safeParseArray(resumeData.projects);
        const savedCertificates = this.safeParseArray(resumeData.certificates);
        const savedLanguages = this.safeParseArray(resumeData.languages);

        this.skills.clear();
        savedSkills.forEach((skill: string) => {
          this.skills.push(
            new FormControl(skill, { nonNullable: true, validators: Validators.required })
          );
        });
        if (this.skills.length === 0) {
          this.skills.push(new FormControl('', { nonNullable: true }));
        }

        this.projects.clear();
        savedProjects.forEach((project: any) => {
          this.projects.push(
            new FormGroup({
              title: new FormControl(project.title, { nonNullable: true, validators: Validators.required }),
              description: new FormControl(project.description, { nonNullable: true, validators: Validators.required }),
              technologies: new FormControl(project.technologies, { nonNullable: true, validators: Validators.required })
            })
          );
        });
        if (this.projects.length === 0) {
          this.projects.push(new FormGroup({
            title: new FormControl('', { nonNullable: true }),
            description: new FormControl('', { nonNullable: true }),
            technologies: new FormControl('', { nonNullable: true })
          }));
        }

        this.certificates.clear();
        savedCertificates.forEach((certificate: any) => {
          this.certificates.push(
            new FormGroup({
              name: new FormControl(certificate.name, { nonNullable: true, validators: Validators.required }),
              issuer: new FormControl(certificate.issuer, { nonNullable: true, validators: Validators.required })
            })
          );
        });
        if (this.certificates.length === 0) {
          this.certificates.push(new FormGroup({
            name: new FormControl('', { nonNullable: true }),
            issuer: new FormControl('', { nonNullable: true })
          }));
        }

        this.languages.clear();
        savedLanguages.forEach((language: any) => {
          this.languages.push(
            new FormGroup({
              name: new FormControl(language.name, { nonNullable: true, validators: Validators.required }),
              proficiency: new FormControl(language.proficiency, { nonNullable: true, validators: Validators.required })
            })
          );
        });
        if (this.languages.length === 0) {
          this.languages.push(new FormGroup({
            name: new FormControl('', { nonNullable: true }),
            proficiency: new FormControl('', { nonNullable: true })
          }));
        }

        console.log('Resume loaded into form successfully!');

      },

      error: (error) => {
        console.error('Failed to load resume from database:', error);
      }

    });

  }

  /**
   * Safely parses a JSON string coming from the backend into an array.
   * Returns [] instead of throwing if the value is missing or malformed,
   * so one corrupted record can't crash the whole form load.
   */
  private safeParseArray(raw: string | null | undefined): any[] {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse resume data from database:', error);
      return [];
    }
  }

  saveResume() {

    if (this.resumeForm.invalid) {
      this.resumeForm.markAllAsTouched();
      return;
    }

    const formValue = this.resumeForm.value;

    const cleanSkills = (formValue.skills ?? []).filter(skill => skill?.trim());

    const cleanProjects = (formValue.projects ?? []).filter(project =>
      project.title?.trim() || project.description?.trim() || project.technologies?.trim()
    );

    const cleanCertificates = (formValue.certificates ?? []).filter(certificate =>
      certificate.name?.trim() || certificate.issuer?.trim()
    );

    const cleanLanguages = (formValue.languages ?? []).filter(language =>
      language.name?.trim() || language.proficiency?.trim()
    );

    const resumeData = {
      id: this.currentResumeId ?? 0,
      fullName: formValue.personalInfo?.fullName,
      email: formValue.personalInfo?.email,
      phone: formValue.personalInfo?.phone,
      gitHub: formValue.personalInfo?.github,
      linkedIn: formValue.personalInfo?.linkedin,
      education: formValue.background?.education,
      experience: formValue.background?.experience,

      skills: JSON.stringify(cleanSkills),
      projects: JSON.stringify(cleanProjects),
      certificates: JSON.stringify(cleanCertificates),
      languages: JSON.stringify(cleanLanguages)
    };

    if (this.currentResumeId !== null) {

      this.resumeService.updateResume(this.currentResumeId, resumeData).subscribe({
        next: () => {
          console.log('Resume updated successfully:', this.currentResumeId);
          alert('Resume updated successfully! ✅');
        },
        error: (error) => {
          console.error('Update failed:', error);
          alert('Failed to update resume ❌');
        }
      });

    } else {

      this.resumeService.createResume(resumeData).subscribe({
        next: (response) => {
          this.currentResumeId = response.id;
          console.log('New resume created:', response);
          alert('Resume saved successfully! ✅');
        },
        error: (error) => {
          console.error('Save failed:', error);
          alert('Failed to save resume ❌');
        }
      });

    }

  }

}
