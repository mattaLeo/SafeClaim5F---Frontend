import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeicoliService } from '../services/veicoli';
import { Sinistri } from '../services/sinistri';
import { sinistro } from '../models/sinistro.model';

@Component({
  selector: 'app-nuovo-sinistro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuovo-sinistro.component.html',
  styleUrl: './nuovo-sinistro.component.css'
})
export class NuovoSinistroComponent implements OnInit {
  @Output() created = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  loading = false;
  errorMessage = '';
  successMessage = '';

  formData = {
    targa: '',
    descrizione: '',
    data_evento: new Date().toISOString().split('T')[0],
    automobilista_id: 1 
  };

  constructor(
    public veicoliService: VeicoliService,
    private sinistriService: Sinistri
  ) {}

  ngOnInit(): void {
    // Carica i veicoli dell'utente 1 all'avvio
    this.aggiornaVeicoli();
  }

  // Funzione che scarica i veicoli ogni volta che l'ID cambia nell'input
  aggiornaVeicoli(): void {
    this.errorMessage = '';
    
    if (this.formData.automobilista_id) {
      this.veicoliService.askVeicoli(this.formData.automobilista_id).subscribe({
        next: (res) => {
          if (res.length === 0) {
            this.errorMessage = "Nessun veicolo trovato per questo utente.";
          }
        },
        error: () => {
          this.errorMessage = "Errore nel caricamento veicoli.";
          this.veicoliService.veicoli = []; 
        }
      });
    } else {
      this.veicoliService.veicoli = [];
    }
  }

  selectVeicolo(targa: string): void {
    this.formData.targa = targa;
  }

  submit(): void {
    if (!this.formData.targa) {
      this.errorMessage = "Seleziona un veicolo prima di inviare!";
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload: sinistro = {
      targa: this.formData.targa,
      descrizione: this.formData.descrizione,
      data_evento: new Date(this.formData.data_evento),
      automobilista_id: Number(this.formData.automobilista_id)
    };

    this.sinistriService.createSinistro(payload).subscribe({
      next: () => {
        this.successMessage = "Sinistro registrato con successo!";
        setTimeout(() => {
          this.created.emit();
          this.loading = false;
        }, 1500);
      },
      error: () => {
        this.errorMessage = "Errore durante il salvataggio.";
        this.loading = false;
      }
    });
  }

  close(): void {
    this.closed.emit();
  }
}