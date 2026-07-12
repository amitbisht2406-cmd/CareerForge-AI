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
}
