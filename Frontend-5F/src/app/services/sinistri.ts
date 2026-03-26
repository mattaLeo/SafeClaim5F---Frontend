import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { sinistro } from '../models/sinistro.model';

@Injectable({ providedIn: 'root' })
export class Sinistri {
  // URL della porta 7000
  private baseUrl = "https://special-halibut-pjjxxg9w5464hr6jp-7000.app.github.dev";
  
  private sinistriSubject = new Subject<sinistro[]>();
  obsSinistri = this.sinistriSubject.asObservable();

  constructor(private http: HttpClient) {}

  askSinistri(): void {
    // Chiamata alla rotta /sinistri (plurale) creata in Python
    this.http.get<sinistro[]>(`${this.baseUrl}/sinistri`).subscribe({
      next: (data) => {
        this.sinistriSubject.next(data);
      },
      error: (err) => console.error("Errore Porta 7000 (Sinistri):", err)
    });
  }

  createSinistro(nuovo: sinistro): Observable<any> {
    return this.http.post(`${this.baseUrl}/sinistro`, nuovo);
  }
}