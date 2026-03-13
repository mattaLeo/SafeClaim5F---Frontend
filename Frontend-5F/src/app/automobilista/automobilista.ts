import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component';
import { Sinistri } from '../services/sinistri';
import { sinistro } from '../models/sinistro.model';
import { VeicoliService } from '../services/veicoli'; 
import { Veicolo } from '../models/veicolo.model';

@Component({
  selector: 'app-automobilista', // Nome del tag HTML del componente
  standalone: true, // Indica che il componente si gestisce i propri import
  // Registriamo il componente figlio 'NuovoSinistro' per poterlo mostrare nella dashboard
  imports: [CommonModule, NuovoSinistroComponent],
  templateUrl: './automobilista.html',
  styleUrl: './automobilista.css',
})

export class Automobilista implements OnInit {
  showNewSinistro = false;
  
  veicoloSelezionato: Veicolo | null = null;

  constructor(private sinistri: Sinistri) {
    public veicoliService: VeicoliService, // Public per usarlo direttamente nell'HTML
    private router: Router
  }

  ngOnInit(): void {
    // load sinistri from service (if server is available)
    this.sinistri.askSinistri();
  }

  /**
   * Expose the service array directly, so template always reads from the source of truth.
   * When nuovo-sinistro adds a sinistro via service.createSinistro(),
   * this getter will reflect the change immediately.
   */
  get sinistriList(): sinistro[] {
    return this.sinistri.sinistri;
  }
  
  vaiAVeicoli(): void {
    this.router.navigate(['/veicoli']);
  }

  openNewSinistro(): void {
    this.showNewSinistro = true;
  }
  
  cercaSingoloVeicolo(id: number): void {
    // Chiamata al service che restituisce un Observable
    this.veicoliService.getVeicoloById(id).subscribe({
      // Caso successo (next): il dato 'v' arriva da Python/Flask
      next: (v) => {
        this.veicoloSelezionato = v; // Aggiorniamo la variabile locale
        console.log("Dettaglio veicolo caricato:", v);
      },
      // Caso errore: gestione dell'eccezione se il server non risponde o l'id non esiste
      error: (err) => console.error("Errore nel recupero del singolo veicolo", err)
    });
  }

  // Chiude il componente del form riportando la variabile a false
  closeNewSinistro(): void {
    this.showNewSinistro = false;
  }

  /**
   * receive the sinistro object emitted by NuovoSinistroComponent and push it
   * into the shared array immediately so the dashboard reflects the change
   * without waiting for any network response. In case the object already has
   * a non-APERTO state (eg. set by the child on HTTP error), we treat it as a
   * simulated entry by normalising the status text.
   */
  onSinistroCreated(s: sinistro) {
    const entry = { ...s } as sinistro;
    if (entry.stato && entry.stato !== 'APERTO') {
      entry.stato = 'SIMULAZIONE';
    }
    // avoid duplicates: check by targa + data_evento + descrizione
    const sameExists = this.sinistriList.some(e => {
      try {
        const eDate = new Date(e.data_evento).getTime();
        const sDate = new Date(entry.data_evento).getTime();
        return e.targa === entry.targa && e.descrizione === entry.descrizione && eDate === sDate;
      } catch (err) {
        return false;
      }
    });
    if (!sameExists) {
      this.sinistriList.push(entry);
    }
  }


}


}
