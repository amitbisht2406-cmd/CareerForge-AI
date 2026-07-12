import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.css']
})
export class ResumePreview {
  @Input({ required: true }) form!: FormGroup;

  @ViewChild('previewPaper') previewPaperRef!: ElementRef<HTMLElement>;

  isGeneratingPDF = false;

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

    } catch (error) {

      console.error('PDF generation failed:', error);

    } finally {

      this.isGeneratingPDF = false;

    }

  }
}
