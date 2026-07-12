import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<{ fullName: string; email: string }>(`${this.apiUrl}/me`);
  }

  updateProfile(data: { fullName: string; email: string }) {
    return this.http.put(`${this.apiUrl}/me`, data);
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.http.put(`${this.apiUrl}/me/password`, data);
  }
}