import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  profileMessage = '';
  passwordMessage = '';

  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
      },
      error: (error) => console.error('Failed to load profile:', error)
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.userService.updateProfile(this.profileForm.value as any).subscribe({
      next: () => {
        this.profileMessage = 'Profile updated successfully ✅';
        localStorage.setItem('fullName', this.profileForm.value.fullName ?? '');
      },
      error: () => {
        this.profileMessage = 'Failed to update profile ❌';
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.userService.changePassword(this.passwordForm.value as any).subscribe({
      next: () => {
        this.passwordMessage = 'Password changed successfully ✅';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.passwordMessage = err.error || 'Failed to change password ❌';
      }
    });
  }
}