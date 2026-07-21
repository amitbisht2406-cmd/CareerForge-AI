import { Component, ElementRef, Input, OnInit, ViewChild, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Notifications } from '../../../../services/notifications';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.css']
})
export class ResumePreview implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() templateId: number = 1;

  @ViewChild('previewPaper') previewPaperRef!: ElementRef<HTMLElement>;

  private notifications = inject(Notifications);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  isGeneratingPDF = false;

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  get personalInfo(): FormGroup {
    return this.form.get('personalInfo') as FormGroup;
  }

  get background(): FormGroup {
    return this.form.get('background') as FormGroup;
  }

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  get projects(): FormArray {
    return this.form.get('projects') as FormArray;
  }

  get certificates(): FormArray {
    return this.form.get('certificates') as FormArray;
  }

  get languages(): FormArray {
    return this.form.get('languages') as FormArray;
  }

  get achievements(): FormArray {
    return this.form.get('achievements') as FormArray;
  }

  get summaryValue(): string {
    return this.form.get('summary')?.value || '';
  }

  get photoBase64(): string {
    return this.personalInfo.get('photoBase64')?.value || '';
  }

  hasSkills(): boolean {
    return this.skills.controls.some(skill => !!skill.value);
  }

  hasProjects(): boolean {
    return this.projects.controls.some(project =>
      !!project.get('title')?.value ||
      !!project.get('description')?.value ||
      !!project.get('technologies')?.value
    );
  }

  hasCertificates(): boolean {
    return this.certificates.controls.some(certificate =>
      !!certificate.get('name')?.value ||
      !!certificate.get('issuer')?.value
    );
  }

  hasLanguages(): boolean {
    return this.languages.controls.some(language =>
      !!language.get('name')?.value ||
      !!language.get('proficiency')?.value
    );
  }

  hasAchievements(): boolean {
    return this.achievements.controls.some(a => !!a.value);
  }

  hasResumeContent(): boolean {
    return !!this.personalInfo.get('fullName')?.value?.trim();
  }

  async downloadPDF() {

    if (this.isGeneratingPDF) {
      return;
    }

    this.isGeneratingPDF = true;

    try {

      const resume = this.previewPaperRef?.nativeElement;

      if (!resume) {
        return;
      }

      const canvas = await html2canvas(resume, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imageData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 5;

      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);

      const widthRatio = availableWidth / canvas.width;
      const heightRatio = availableHeight / canvas.height;

      const scaleRatio = Math.min(widthRatio, heightRatio);

      const finalWidth = canvas.width * scaleRatio;
      const finalHeight = canvas.height * scaleRatio;

      const x = (pageWidth - finalWidth) / 2;
      const y = margin;

      pdf.addImage(imageData, 'PNG', x, y, finalWidth, finalHeight);

      const fullName = this.personalInfo.get('fullName')?.value?.trim() || 'Resume';
      const fileName = fullName.replace(/\s+/g, '-') + '-Resume.pdf';

      pdf.save(fileName);

      this.notifications.add('Resume PDF downloaded', '⬇️');

    } catch (error) {

      console.error('PDF generation failed:', error);

    } finally {

      this.isGeneratingPDF = false;

    }

  }
}