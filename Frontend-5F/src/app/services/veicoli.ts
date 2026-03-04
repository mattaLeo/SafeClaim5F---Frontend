import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Veicolo {
  id?: number;
  marca: string;
  modello: string;
}

@Injectable({
  providedIn: 'root',
})
export class VeicoliService {
  private apiUrl = 'https://sturdy-space-train-wrrww9x6prwjf9vw9-6000.app.github.dev/'; 

  constructor(private http: HttpClient) {}

  getVeicoli(): Observable<Veicolo[]> {
    return this.http.get<Veicolo[]>(this.apiUrl);
  }

  addVeicolo(nuovoVeicolo: Veicolo): Observable<Veicolo> {
    return this.http.post<Veicolo>(this.apiUrl, nuovoVeicolo);
  }
}