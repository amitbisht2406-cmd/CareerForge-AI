import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Resume } from '../../services/resume';
import { Notifications } from '../../services/notifications';
import { ActivatedRoute } from '@angular/router';

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
  styleUrls: ['./resume-builder.css', './shared/resume-shared.css']
})
export class ResumeBuilder implements OnInit {

  currentResumeId: number | null = null;
  currentTemplateId = 1;

  templateOptions = [
    { id: 1, name: 'Classic' },
    { id: 2, name: 'Modern' },
    { id: 3, name: 'Minimal' },
    { id: 4, name: 'Professional' }
  ];

  selectTemplate(id: number) {
    this.currentTemplateId = id;
  }

  private platformId = inject(PLATFORM_ID);
  private notifications = inject(Notifications);

  constructor(
  private resumeService: Resume,
  private route: ActivatedRoute
) {}

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
      }),

      photoBase64: new FormControl('', { nonNullable: true })

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

    summary: new FormControl('', { nonNullable: true }),

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
    ]),

    achievements: new FormArray([
      new FormControl('', { nonNullable: true })
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

  get achievements(): FormArray {
    return this.resumeForm.get('achievements') as FormArray;
  }

  addAchievement() {
    this.achievements.push(new FormControl('', { nonNullable: true }));
  }

  removeAchievement(index: number) {
    if (this.achievements.length > 1) {
      this.achievements.removeAt(index);
    }
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

        const resumeIdParam = this.route.snapshot.queryParamMap.get('resumeId');

const resumeData = resumeIdParam
  ? resumes.find(r => r.id === Number(resumeIdParam))
  : resumes[resumes.length - 1];

if (!resumeData) {
  console.error('Requested resume not found');
  this.notifications.add('Resume not found', '⚠️');
  return;
}
        this.currentResumeId = resumeData.id;
        this.currentTemplateId = resumeData.templateId ?? 1;

        console.log('Loading resume from database:', resumeData);

        this.personalInfo.patchValue({
          fullName: resumeData.fullName,
          email: resumeData.email,
          phone: resumeData.phone,
          github: resumeData.gitHub,
          linkedin: resumeData.linkedIn,
          photoBase64: resumeData.photoBase64
        });

        this.background.patchValue({
          education: resumeData.education,
          experience: resumeData.experience
        });

        this.resumeForm.patchValue({
          summary: resumeData.summary
        });

        const savedSkills = this.safeParseArray(resumeData.skills);
        const savedProjects = this.safeParseArray(resumeData.projects);
        const savedCertificates = this.safeParseArray(resumeData.certificates);
        const savedLanguages = this.safeParseArray(resumeData.languages);
        const savedAchievements = this.safeParseArray(resumeData.achievements);

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

        this.achievements.clear();
        savedAchievements.forEach((item: string) => {
          this.achievements.push(new FormControl(item, { nonNullable: true }));
        });
        if (this.achievements.length === 0) {
          this.achievements.push(new FormControl('', { nonNullable: true }));
        }

        console.log('Resume loaded into form successfully!');

      },

      error: (error) => {
        console.error('Failed to load resume from database:', error);
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

    const cleanAchievements = (formValue.achievements ?? []).filter(a => a?.trim());

    const resumeData = {
      id: this.currentResumeId ?? 0,
      fullName: formValue.personalInfo?.fullName,
      email: formValue.personalInfo?.email,
      phone: formValue.personalInfo?.phone,
      gitHub: formValue.personalInfo?.github,
      linkedIn: formValue.personalInfo?.linkedin,
      photoBase64: formValue.personalInfo?.photoBase64,
      summary: formValue.summary,
      education: formValue.background?.education,
      experience: formValue.background?.experience,

      skills: JSON.stringify(cleanSkills),
      projects: JSON.stringify(cleanProjects),
      certificates: JSON.stringify(cleanCertificates),
      languages: JSON.stringify(cleanLanguages),
      achievements: JSON.stringify(cleanAchievements),
      templateId: this.currentTemplateId
    };

    if (this.currentResumeId !== null) {

      this.resumeService.updateResume(this.currentResumeId, resumeData).subscribe({
        next: () => {
          console.log('Resume updated successfully:', this.currentResumeId);
          this.notifications.add('Resume updated successfully', '📄');
        },
        error: (error) => {
          console.error('Update failed:', error);
          this.notifications.add('Failed to update resume', '⚠️');
        }
      });

    } else {

      this.resumeService.createResume(resumeData).subscribe({
        next: (response) => {
          this.currentResumeId = response.id;
          console.log('New resume created:', response);
          this.notifications.add('Resume saved successfully', '📄');
        },
        error: (error) => {
          console.error('Save failed:', error);
          this.notifications.add('Failed to save resume', '⚠️');
        }
      });

    }

  }

  deleteResume() {
    if (this.currentResumeId === null) {
      return;
    }

    if (!confirm('Delete this resume? This cannot be undone.')) {
      return;
    }

    this.resumeService.deleteResume(this.currentResumeId).subscribe({
      next: () => {
        this.currentResumeId = null;
        this.resumeForm.reset();
        this.skills.clear();
        this.skills.push(new FormControl('', { nonNullable: true }));
        this.projects.clear();
        this.projects.push(new FormGroup({
          title: new FormControl('', { nonNullable: true }),
          description: new FormControl('', { nonNullable: true }),
          technologies: new FormControl('', { nonNullable: true })
        }));
        this.certificates.clear();
        this.certificates.push(new FormGroup({
          name: new FormControl('', { nonNullable: true }),
          issuer: new FormControl('', { nonNullable: true })
        }));
        this.languages.clear();
        this.languages.push(new FormGroup({
          name: new FormControl('', { nonNullable: true }),
          proficiency: new FormControl('', { nonNullable: true })
        }));
        this.achievements.clear();
        this.achievements.push(new FormControl('', { nonNullable: true }));
        this.currentTemplateId = 1;
        this.notifications.add('Resume deleted', '🗑️');
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.notifications.add('Failed to delete resume', '⚠️');
      }
    });
  }

}