import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veicolo } from '../models/veicolo.model';

@Injectable({
  providedIn: 'root',
})
export class VeicoliService {
  // Indirizzo del server (assicurati che sia quello attivo)
  private link = 'https://supreme-space-happiness-v66xxgwrjjx9hj6v-5000.app.github.dev'; 

  // Qui memorizziamo i veicoli scaricati dal server
  public veicoli: Veicolo[] = [];
  public obsVeicoli!: Observable<Veicolo[]>;

  constructor(private http: HttpClient) {}

  // Funzione che scarica i dati e aggiorna l'array locale
  askVeicoli() {
    this.obsVeicoli = this.http.get<Veicolo[]>(this.link + '/veicoli');
    this.obsVeicoli.subscribe((data) => {
      this.veicoli = data;
      console.log("Veicoli aggiornati:", this.veicoli);
    });
  }
}