import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../../services/portfolio';
import { Resume } from '../../services/resume';
import { Notifications } from '../../services/notifications';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './portfolio-builder.html',
  styleUrl: './portfolio-builder.css'
})
export class PortfolioBuilder implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private portfolioService = inject(Portfolio);
  private resumeService = inject(Resume);
  private notifications = inject(Notifications);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  currentPortfolioId: number | null = null;

  // List of the user's own resumes, so they can optionally link one
  // to this portfolio (powers the public "Download Resume" button
  // and pulls Education/Experience/Certificates into the public page).
  myResumes: any[] = [];

  portfolioForm = new FormGroup({

    heroTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    heroTagline: new FormControl('', { nonNullable: true }),
    about: new FormControl('', { nonNullable: true }),

    skills: new FormArray([
      new FormControl('', { nonNullable: true })
    ]),

    projects: new FormArray([
      new FormGroup({
        title: new FormControl('', { nonNullable: true }),
        description: new FormControl('', { nonNullable: true }),
        link: new FormControl('', { nonNullable: true }),
        githubLink: new FormControl('', { nonNullable: true }),
        techStack: new FormControl('', { nonNullable: true })
      })
    ]),

    contactEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    contactPhone: new FormControl('', { nonNullable: true }),

    githubUrl: new FormControl('', { nonNullable: true }),
    linkedinUrl: new FormControl('', { nonNullable: true }),
    resumeId: new FormControl<number | null>(null)

  });

  get skills(): FormArray {
    return this.portfolioForm.get('skills') as FormArray;
  }

  get projects(): FormArray {
    return this.portfolioForm.get('projects') as FormArray;
  }

  hasSkills(): boolean {
    return this.skills.controls.some(skill => !!skill.value);
  }

  hasProjects(): boolean {
    return this.projects.controls.some(project =>
      !!project.get('title')?.value || !!project.get('description')?.value
    );
  }

  ngOnInit() {

    // Live preview fix — force re-render on every keystroke, zone or zoneless.
    this.portfolioForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Load the user's resumes for the "link a resume" dropdown.
    this.resumeService.getResumes().subscribe({
      next: (resumes) => {
        this.myResumes = resumes ?? [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load resumes for linking:', error);
      }
    });

    this.portfolioService.getPortfolios().subscribe({

      next: (portfolios) => {

        if (portfolios.length === 0) {
          return;
        }

        const portfolioIdParam = this.route.snapshot.queryParamMap.get('portfolioId');
        const data = portfolioIdParam
          ? portfolios.find(p => p.id === Number(portfolioIdParam)) ?? portfolios[portfolios.length - 1]
          : portfolios[portfolios.length - 1];

        this.currentPortfolioId = data.id;

        this.portfolioForm.patchValue({
          heroTitle: data.heroTitle,
          heroTagline: data.heroTagline,
          about: data.about,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          resumeId: data.resumeId ?? null
        });

        const savedSkills = this.safeParseArray(data.skills);
        const savedProjects = this.safeParseArray(data.projects);

        this.skills.clear();
        savedSkills.forEach((skill: string) => {
          this.skills.push(new FormControl(skill, { nonNullable: true }));
        });
        if (this.skills.length === 0) {
          this.skills.push(new FormControl('', { nonNullable: true }));
        }

        this.projects.clear();
        savedProjects.forEach((project: any) => {
          this.projects.push(new FormGroup({
            title: new FormControl(project.title ?? '', { nonNullable: true }),
            description: new FormControl(project.description ?? '', { nonNullable: true }),
            link: new FormControl(project.link ?? '', { nonNullable: true }),
            githubLink: new FormControl(project.githubLink ?? '', { nonNullable: true }),
            techStack: new FormControl(project.techStack ?? '', { nonNullable: true })
          }));
        });
        if (this.projects.length === 0) {
          this.projects.push(new FormGroup({
            title: new FormControl('', { nonNullable: true }),
            description: new FormControl('', { nonNullable: true }),
            link: new FormControl('', { nonNullable: true }),
            githubLink: new FormControl('', { nonNullable: true }),
            techStack: new FormControl('', { nonNullable: true })
          }));
        }

        this.cdr.markForCheck();

      },

      error: (error) => {
        console.error('Failed to load portfolio:', error);
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
      console.error('Failed to parse portfolio data:', error);
      return [];
    }
  }

  get publicPortfolioLink(): string {
    if (this.currentPortfolioId === null || typeof window === 'undefined') {
      return '';
    }
    return `${window.location.origin}/portfolio/${this.currentPortfolioId}`;
  }

  copyPublicLink(): void {
    if (!this.publicPortfolioLink) {
      return;
    }
    navigator.clipboard.writeText(this.publicPortfolioLink);
    this.notifications.add('Portfolio link copied!', '🔗');
  }

  addSkill() {
    this.skills.push(new FormControl('', { nonNullable: true }));
  }

  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  addProject() {
    this.projects.push(new FormGroup({
      title: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      link: new FormControl('', { nonNullable: true }),
      githubLink: new FormControl('', { nonNullable: true }),
      techStack: new FormControl('', { nonNullable: true })
    }));
  }

  removeProject(index: number) {
    if (this.projects.length > 1) {
      this.projects.removeAt(index);
    }
  }

  savePortfolio() {

    if (this.portfolioForm.invalid) {
      this.portfolioForm.markAllAsTouched();
      return;
    }

    const formValue = this.portfolioForm.value;

    const cleanSkills = (formValue.skills ?? []).filter(skill => skill?.trim());
    const cleanProjects = (formValue.projects ?? []).filter(project =>
      project.title?.trim() || project.description?.trim()
    );

    const data = {
      id: this.currentPortfolioId ?? 0,
      heroTitle: formValue.heroTitle,
      heroTagline: formValue.heroTagline,
      about: formValue.about,
      skills: JSON.stringify(cleanSkills),
      projects: JSON.stringify(cleanProjects),
      contactEmail: formValue.contactEmail,
      contactPhone: formValue.contactPhone,
      githubUrl: formValue.githubUrl,
      linkedinUrl: formValue.linkedinUrl,
      resumeId: formValue.resumeId ?? null
    };

    if (this.currentPortfolioId !== null) {

      this.portfolioService.updatePortfolio(this.currentPortfolioId, data).subscribe({
        next: () => {
          this.notifications.add('Portfolio updated successfully', '🌐');
        },
        error: (error) => {
          console.error('Update failed:', error);
          this.notifications.add('Failed to update portfolio', '⚠️');
        }
      });

    } else {

      this.portfolioService.createPortfolio(data).subscribe({
        next: (response) => {
          this.currentPortfolioId = response.id;
          this.notifications.add('Portfolio saved successfully', '🌐');
        },
        error: (error) => {
          console.error('Save failed:', error);
          this.notifications.add('Failed to save portfolio', '⚠️');
        }
      });

    }

  }

  deletePortfolio() {
    if (this.currentPortfolioId === null) {
      return;
    }

    if (!confirm('Delete this portfolio? This cannot be undone.')) {
      return;
    }

    this.portfolioService.deletePortfolio(this.currentPortfolioId).subscribe({
      next: () => {
        this.currentPortfolioId = null;
        this.portfolioForm.reset();
        this.skills.clear();
        this.skills.push(new FormControl('', { nonNullable: true }));
        this.projects.clear();
        this.projects.push(new FormGroup({
          title: new FormControl('', { nonNullable: true }),
          description: new FormControl('', { nonNullable: true }),
          link: new FormControl('', { nonNullable: true }),
          githubLink: new FormControl('', { nonNullable: true }),
          techStack: new FormControl('', { nonNullable: true })
        }));
        this.notifications.add('Portfolio deleted', '🗑️');
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.notifications.add('Failed to delete portfolio', '⚠️');
      }
    });
  }

}
