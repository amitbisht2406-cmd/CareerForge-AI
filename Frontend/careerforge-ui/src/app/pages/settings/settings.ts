import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  profileMessage = '';
  passwordMessage = '';
  hasPassword = true;

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
      next: (profile: any) => {
        this.profileForm.patchValue(profile);

        this.hasPassword = profile.hasPassword ?? true;

        // Accounts created via Google have no password yet -
        // there's nothing to verify, so drop the requirement on
        // that field instead of asking for a password that
        // doesn't exist.
        if (!this.hasPassword) {
          this.passwordForm.get('currentPassword')?.clearValidators();
          this.passwordForm.get('currentPassword')?.updateValueAndValidity();
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.cdr.detectChanges();
      }
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.profileMessage = 'Failed to update profile ❌';
        this.cdr.detectChanges();
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
        this.passwordMessage = this.hasPassword
          ? 'Password changed successfully ✅'
          : 'Password set successfully ✅ You can now log in with your email and password too.';

        this.hasPassword = true;
        this.passwordForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.passwordMessage = err.error || 'Failed to change password ❌';
        this.cdr.detectChanges();
      }
    });
  }
}
