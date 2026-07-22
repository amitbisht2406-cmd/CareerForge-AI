import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}


  // =========================
  // REGISTER
  // =========================

  register(data: {
    fullName: string;
    email: string;
    password: string;
  }) {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );

  }


  // =========================
  // LOGIN
  // =========================

  login(data: {
    email: string;
    password: string;
  }) {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(

      tap((response) => {

        // Save authentication data
        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'fullName',
          response.fullName
        );

        localStorage.setItem(
          'email',
          response.email
        );

      })

    );

  }


  // =========================
  // GET TOKEN
  // =========================

  getToken(): string | null {

    return localStorage.getItem('token');

  }


  // =========================
  // CHECK LOGIN
  // =========================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');

  }

}