import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Rende il servizio disponibile in tutta l'app (Singleton)
export class VeicoliService {
  // Indirizzo del server Backend Python (Flask) che gira sulla porta 5000
  private baseUrl = "https://special-halibut-pjjxxg9w5464hr6jp-5000.app.github.dev";
  
  // Array pubblico dove salviamo i dati ricevuti, così i componenti possono leggerli facilmente
  public veicoli: any[] = [];

  constructor(private http: HttpClient) {} // Inietta lo strumento HttpClient per fare richieste web

  // Funzione che richiede al database i veicoli associati a un ID utente specifico
  askVeicoli(userId: number): Observable<any[]> {
    // Effettua una chiamata GET all'URL dinamico 
    return this.http.get<any[]>(`${this.baseUrl}/veicoli-utente/${userId}`).pipe(
      tap((data) => { // L'operatore 'tap' ci permette di eseguire un'azione appena arrivano i dati
        this.veicoli = data; // Salviamo la lista di auto dentro la nostra variabile pubblica 'veicoli'
      })
    );
  }
}