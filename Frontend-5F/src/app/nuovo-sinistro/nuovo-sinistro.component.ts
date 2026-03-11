import { Component, Output, EventEmitter, OnInit } from '@angular/core'; // Aggiunto OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sinistri } from '../services/sinistri';
import { VeicoliService } from '../services/veicoli'; // IMPORTANTE: Importa il service dei veicoli
import { sinistro } from '../models/sinistro.model';

@Component({
  selector: 'app-nuovo-sinistro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuovo-sinistro.component.html',
  styleUrl: './nuovo-sinistro.component.css',
})
export class NuovoSinistroComponent implements OnInit { // Aggiunto implements OnInit
  @Output() created = new EventEmitter<sinistro>();
  @Output() closed = new EventEmitter<void>();

  formData = {
    automobilista_id: 0,
    targa: '',
    data_evento: '',
    descrizione: '',
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  // 1. ELIMINATA la lista statica 'vehicles'. 
  // Ora useremo direttamente 'veicoliService.veicoli' nell'HTML.

  // 2. Iniezione della Dependency Injection: aggiungiamo VeicoliService
  constructor(
    private sinistri: Sinistri, 
    public veicoliService: VeicoliService // 'public' per usarlo nell'HTML
  ) {}

  // 3. ngOnInit: quando il form si apre, scarichiamo i dati reali dal DB
  ngOnInit(): void {
    this.veicoliService.askVeicoli().subscribe({
      error: (err) => console.error("Errore nel caricamento veicoli per il form", err)
    });
  }

  // Funzione per gestire la selezione della card
  selectVehicle(targa: string) {
    // Aggiorniamo la targa nel modello del form
    this.formData.targa = targa;
    console.log("Veicolo selezionato dal DB:", targa);
  }

  // ... restanti metodi (submit, close, resetForm) rimangono uguali ...
  submit(): void {
     // ... logica di submit già esistente ...
  }

  close(): void {
    this.closed.emit();
  }

  resetForm(): void {
    this.formData = { automobilista_id: 0, targa: '', data_evento: '', descrizione: '' };
    // Non serve più resettare i selected a mano perché lo gestiamo col confronto targa nell'HTML
  }
}