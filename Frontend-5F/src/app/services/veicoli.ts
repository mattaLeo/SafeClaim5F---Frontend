import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VeicoliService {
  private baseUrl = "https://special-halibut-pjjxxg9w5464hr6jp-5000.app.github.dev";
  public veicoli: any[] = [];

  constructor(private http: HttpClient) {}

  askVeicoli(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/veicoli-utente/${userId}`).pipe(
      tap((data) => {
        this.veicoli = data;
      })
    );
  }
}