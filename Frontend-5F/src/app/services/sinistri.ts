import { Injectable } from '@angular/core'; // Rimosso OnInit perché non funziona nei servizi
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs'; // Usiamo BehaviorSubject invece di Subject
import { sinistro } from '../models/sinistro.model'; // Importiamo la struttura dati del sinistro

@Injectable({ providedIn: 'root' }) // Rende il servizio unico e disponibile in tutta l'applicazione
export class Sinistri {
  // L'indirizzo del server Flask che gestisce i sinistri sulla porta 7000
  private baseUrl = "https://special-halibut-pjjxxg9w5464hr6jp-7000.app.github.dev";
  
  // Il BehaviorSubject memorizza l'ultimo valore emesso (inizialmente un array vuoto)
  private sinistriSubject = new BehaviorSubject<sinistro[]>([]);
  
  // Trasformiamo il Subject in un Observable pubblico così i componenti possono solo "ascoltare" senza modificare
  obsSinistri = this.sinistriSubject.asObservable();

  constructor(private http: HttpClient) {} // Inietta HttpClient per le chiamate verso il backend Python

  // Funzione che scarica la lista completa dei sinistri dal database
  askSinistri(): void {
    console.log("Chiamata GET a:", `${this.baseUrl}/sinistri`);
    
    // Fa una richiesta GET alla rotta /sinistri del server Python
    this.http.get<sinistro[]>(`${this.baseUrl}/sinistri`).subscribe({
      next: (data) => {
        console.log("Dati ricevuti dal server:", data);
        // Se la chiamata ha successo, "spara" i dati dentro il Subject (così la tabella si aggiorna)
        this.sinistriSubject.next(data);
      },
      // Se c'è un errore (es. server spento), lo stampa nella console del browser per il debug
      error: (err) => console.error("Errore Porta 7000 (Sinistri):", err)
    });
  }

  // Funzione che invia i dati di un nuovo sinistro compilato nel form
  createSinistro(nuovo: sinistro): Observable<any> {
    // Effettua una richiesta POST inviando l'oggetto 'nuovo' alla rotta /sinistro del server
    // Questo comando aggiunge fisicamente una riga nella tabella sinistri del database MySQL
    return this.http.post(`${this.baseUrl}/sinistro`, nuovo);
  }
}