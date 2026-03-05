import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component';
import { sinistro } from '../models/sinistro.model';
import { VeicoliService } from '../services/veicoli'; // Importiamo il service dei veicoli

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

  // Aggiungiamo VeicoliService nel costruttore per usarlo nell'HTML
  constructor(public veicoliService: VeicoliService) {}

  // Questa funzione viene chiamata dal tasto "Gestisci"
  gestisciVeicoli(): void {
    this.veicoliService.askVeicoli();
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