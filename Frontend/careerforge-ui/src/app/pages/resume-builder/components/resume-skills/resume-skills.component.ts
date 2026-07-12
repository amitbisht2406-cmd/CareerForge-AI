import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-resume-skills',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-skills.component.html',
  styleUrls: ['./resume-skills.component.css', '../../shared/resume-shared.css']
})
export class ResumeSkills {
  @Input({ required: true }) skills!: FormArray;

  // Template helper: FormArray.controls is typed as AbstractControl[],
  // but each item here is always a FormControl<string>. Casting here
  // (instead of using $any in the template) keeps the template type-safe.
  asControl(control: AbstractControl): FormControl<string> {
    return control as FormControl<string>;
  }

  addSkill() {
    this.skills.push(new FormControl('', { nonNullable: true, validators: Validators.required }));
  }

  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }
}
