import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component';
import { sinistro } from '../models/sinistro.model';
import { VeicoliService } from '../services/veicoli'; 
import { Veicolo } from '../models/veicolo.model'; // Importa anche il modello Veicolo

@Component({
  selector: 'app-automobilista',
  standalone: true,
  imports: [CommonModule, NuovoSinistroComponent],
  templateUrl: './automobilista.html',
  styleUrl: './automobilista.css',
})
export class Automobilista {
  showNewSinistro = false;
  sinistri: sinistro[] = [];
  
  // Variabile per memorizzare un eventuale veicolo singolo cercato
  veicoloSelezionato: Veicolo | null = null;

  constructor(public veicoliService: VeicoliService) {}

  // Scarica tutti i veicoli (La lista finirà in veicoliService.veicoli)
  gestisciVeicoli(): void {
    this.veicoliService.askVeicoli().subscribe({
      next: (data) => console.log("Lista caricata con successo", data),
      error: (err) => alert("Errore nel caricamento: " + err.error.error)
    });
  }

  // Esempio: Funzione per cercare un veicolo specifico (es. da un input ID)
  cercaSingoloVeicolo(id: number): void {
    this.veicoliService.getVeicoloById(id).subscribe({
      next: (v) => {
        this.veicoloSelezionato = v;
        console.log("Veicolo trovato:", v);
      },
      error: (err) => alert("Veicolo non trovato!")
    });
  }

  openNewSinistro(): void {
    this.showNewSinistro = true;
  }

  onCreated(s: sinistro): void {
    this.sinistri.push(s);
  }

  closeNewSinistro(): void {
    this.showNewSinistro = false;
  }
}