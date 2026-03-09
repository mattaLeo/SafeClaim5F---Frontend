import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Veicolo } from '../models/veicolo.model';

@Injectable({
  providedIn: 'root',
})
export class VeicoliService {
  // Indirizzo del server
  private link = 'https://ominous-waddle-977ppqw5g46wf99q4-5000.app.github.dev'; 

  // Array locale per mantenere i dati in memoria se serve
  public veicoli: Veicolo[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Recupera TUTTI i veicoli
   * Uso 'tap' per aggiornare l'array locale senza "rompere" l'observable
   */
  askVeicoli(): Observable<Veicolo[]> {
    return this.http.get<Veicolo[]>(`${this.link}/veicoli`).pipe(
      tap((data) => {
        this.veicoli = data;
        console.log("Lista veicoli aggiornata:", this.veicoli);
      })
    );
  }

  /**
   * Recupera un SINGOLO veicolo per ID
   * Corrisponde alla tua rotta Flask: @app.route('/veicoli/<int:id>')
   */
  getVeicoloById(id: number): Observable<Veicolo> {
    return this.http.get<Veicolo>(`${this.link}/veicoli/${id}`).pipe(
      tap((data) => console.log(`Dettaglio veicolo ${id}:`, data))
    );
  }
}