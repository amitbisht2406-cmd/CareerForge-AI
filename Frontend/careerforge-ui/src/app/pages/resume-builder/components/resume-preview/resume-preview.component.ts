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
      throw new Error('Resume preview not found.');
    }

    // Add PDF mode class so CSS can optimize layout during export
    resume.classList.add('pdf-export');

    // Wait for browser to apply PDF styles
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(resume, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: resume.scrollWidth,
      windowHeight: resume.scrollHeight
    });

    resume.classList.remove('pdf-export');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 8;

    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    // Keep original aspect ratio
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // If resume fits on one page
    if (imgHeight <= usableHeight) {

      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin,
        imgWidth,
        imgHeight
      );

    } else {

      // FIX: the old approach re-drew the FULL image on every page at a
      // shifted negative offset. Because jsPDF clips to the full page
      // (0–297mm), not to our margin box, that math drifted after the
      // first page, causing content to repeat or get cut off between
      // pages. Slicing the source canvas itself into exact per-page
      // pixel chunks avoids any drift — each page gets a clean,
      // non-overlapping piece of the resume.

      const pxPerMm = canvas.width / imgWidth;
      const pageSlicePx = Math.floor(usableHeight * pxPerMm);

      let renderedHeightPx = 0;

      while (renderedHeightPx < canvas.height) {

        const sliceHeightPx = Math.min(
          pageSlicePx,
          canvas.height - renderedHeightPx
        );

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeightPx;

        const ctx = sliceCanvas.getContext('2d');
        ctx?.drawImage(
          canvas,
          0, renderedHeightPx, canvas.width, sliceHeightPx,
          0, 0, canvas.width, sliceHeightPx
        );

        const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.98);
        const sliceImgHeightMm = sliceHeightPx / pxPerMm;

        if (renderedHeightPx > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          sliceImgData,
          'JPEG',
          margin,
          margin,
          imgWidth,
          sliceImgHeightMm
        );

        renderedHeightPx += sliceHeightPx;
      }

    }

    const fullName =
      this.personalInfo.get('fullName')?.value?.trim() || 'Resume';

    const safeName = fullName
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    pdf.save(`${safeName}-Resume.pdf`);

    this.notifications.add(
      'Resume PDF downloaded successfully',
      '⬇️'
    );

  } catch (error) {

    console.error('PDF generation failed:', error);

    this.notifications.add(
      'PDF generation failed',
      '⚠️'
    );

  } finally {

    const resume = this.previewPaperRef?.nativeElement;

    if (resume) {
      resume.classList.remove('pdf-export');
    }

    this.isGeneratingPDF = false;
  }
}
}