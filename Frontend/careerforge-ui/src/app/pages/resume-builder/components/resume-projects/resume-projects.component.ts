import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-projects.component.html',
  styleUrls: ['./resume-projects.component.css', '../../shared/resume-shared.css']
})
export class ResumeProjects {
  @Input({ required: true }) projects!: FormArray;

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  addProject() {
    this.projects.push(
      new FormGroup({
        title: new FormControl('', { nonNullable: true }),
        description: new FormControl('', { nonNullable: true }),
        technologies: new FormControl('', { nonNullable: true })
      })
    );
  }

  removeProject(index: number) {
    if (this.projects.length > 1) {
      this.projects.removeAt(index);
    }
  }
}
