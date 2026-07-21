import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-personal.component.html',
  styleUrls: ['./resume-personal.component.css', '../../shared/resume-shared.css']
})
export class ResumePersonal {
  @Input({ required: true }) form!: FormGroup;

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024) {
      alert('Photo must be under 1MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.get('photoBase64')?.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.form.get('photoBase64')?.setValue('');
  }

  get photoBase64(): string {
    return this.form.get('photoBase64')?.value || '';
  }
}