import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-certificates-languages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resume-certificates-languages.component.html',
  styleUrls: ['./resume-certificates-languages.component.css', '../../shared/resume-shared.css']
})
export class ResumeCertificatesLanguages {
  @Input({ required: true }) certificates!: FormArray;
  @Input({ required: true }) languages!: FormArray;

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  addCertificate() {
    this.certificates.push(
      new FormGroup({
        name: new FormControl('', { nonNullable: true }),
        issuer: new FormControl('', { nonNullable: true })
      })
    );
  }

  removeCertificate(index: number) {
    if (this.certificates.length > 1) {
      this.certificates.removeAt(index);
    }
  }

  addLanguage() {
    this.languages.push(
      new FormGroup({
        name: new FormControl('', { nonNullable: true }),
        proficiency: new FormControl('', { nonNullable: true })
      })
    );
  }

  removeLanguage(index: number) {
    if (this.languages.length > 1) {
      this.languages.removeAt(index);
    }
  }
}
