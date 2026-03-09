import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Necessario per cambiare pagina
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component';
import { sinistro } from '../models/sinistro.model';
import { VeicoliService } from '../services/veicoli'; 
import { Veicolo } from '../models/veicolo.model';

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
  veicoloSelezionato: Veicolo | null = null;

  constructor(
    public veicoliService: VeicoliService,
    private router: Router 
  ) {}

  // Questa funzione serve al bottone "Visualizza Veicoli"
  vaiAVeicoli(): void {
    this.router.navigate(['/veicoli']);
  }

  // QUESTA È LA FUNZIONE CHE MANCAVA!
  cercaSingoloVeicolo(id: number): void {
    this.veicoliService.getVeicoloById(id).subscribe({
      next: (v) => {
        this.veicoloSelezionato = v;
        console.log("Dettaglio veicolo caricato:", v);
      },
      error: (err) => console.error("Errore nel recupero del singolo veicolo", err)
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