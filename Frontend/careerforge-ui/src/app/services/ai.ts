import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ResumeReview {
  overallScore: number;
  grammarScore: number;
  atsScore: number;
  skillsScore: number;
  feedback: string;
  missingSkillsSuggestion: string;
}

@Injectable({
  providedIn: 'root'
})
export class Ai {
  private apiUrl = `${environment.apiUrl}/Ai`;

  constructor(private http: HttpClient) {}

  reviewResume(resumeText: string) {
    return this.http.post<ResumeReview>(`${this.apiUrl}/review-resume`, { resumeText });
  }
}