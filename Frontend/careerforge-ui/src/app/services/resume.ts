import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Resume {
  private apiUrl = `${environment.apiUrl}/Resumes`;

  constructor(private http: HttpClient) {}

  createResume(resumeData: any) {
    return this.http.post<any>(this.apiUrl, resumeData);
  }

  getResumes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateResume(id: number, resumeData: any) {
    return this.http.put(`${this.apiUrl}/${id}`, resumeData);
  }

  deleteResume(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}