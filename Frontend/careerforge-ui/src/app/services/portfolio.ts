import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Portfolio {
  private apiUrl = `${environment.apiUrl}/Portfolios`;

  constructor(private http: HttpClient) {}

  createPortfolio(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  getPortfolios() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updatePortfolio(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}