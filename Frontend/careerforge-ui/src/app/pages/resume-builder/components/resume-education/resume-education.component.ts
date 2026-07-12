import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-education.component.html',
  styleUrls: ['./resume-education.component.css', '../../shared/resume-shared.css']
})
export class ResumeEducation {
  @Input({ required: true }) form!: FormGroup;
}
