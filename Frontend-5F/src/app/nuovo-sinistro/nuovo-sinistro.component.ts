import { Component, EventEmitter, OnInit, Output } from '@angular/core'; // Import moduli base
import { CommonModule } from '@angular/common'; // Import direttive standard (ngIf, ngFor)
import { FormsModule } from '@angular/forms'; // Import per gestione form e ngModel
import { VeicoliService } from '../services/veicoli'; // Servizio recupero auto da MySQL
import { Sinistri } from '../services/sinistri'; // Servizio invio dati a MongoDB
import { sinistro } from '../models/sinistro.model'; // Modello dati del sinistro

@Component({
  selector: 'app-nuovo-sinistro', // Tag HTML del componente
  standalone: true, // Componente autonomo senza modulo esterno
  imports: [CommonModule, FormsModule], // Dipendenze per il template
  templateUrl: './nuovo-sinistro.component.html', // File HTML
  styleUrl: './nuovo-sinistro.component.css' // File CSS
})
export class NuovoSinistroComponent implements OnInit {
  @Output() created = new EventEmitter<void>(); // Evento inviato al padre dopo la creazione
  @Output() closed = new EventEmitter<void>(); // Evento inviato al padre per chiudere il popup

  loading = false; // Stato di caricamento per il tasto invio
  errorMessage = ''; // Messaggio in caso di errore
  successMessage = ''; // Messaggio in caso di successo

  formData = {
    targa: '', // Targa selezionata nel form
    descrizione: '', // Testo dell'incidente
    data_evento: new Date().toISOString().split('T')[0], // Data odierna predefinita
    automobilista_id: 1 // ID utente di test
  };

  constructor(
    public veicoliService: VeicoliService, // Iniezione servizio veicoli
    private sinistriService: Sinistri // Iniezione servizio sinistri
  ) {}

  ngOnInit(): void {
    // Carica i veicoli dell'utente 1 all'avvio
    this.aggiornaVeicoli(); // Popola la lista iniziale delle auto
  }

  // Funzione che scarica i veicoli ogni volta che l'ID cambia nell'input
  aggiornaVeicoli(): void {
    this.errorMessage = ''; // Resetta errori precedenti
    
    if (this.formData.automobilista_id) { // Se l'ID esiste, interroga il database
      this.veicoliService.askVeicoli(this.formData.automobilista_id).subscribe({
        next: (res) => { // Se la risposta è positiva
          if (res.length === 0) { // Se l'array è vuoto, avvisa l'utente
            this.errorMessage = "Nessun veicolo trovato per questo utente.";
          }
        },
        error: () => { // Se la chiamata fallisce
          this.errorMessage = "Errore nel caricamento veicoli.";
          this.veicoliService.veicoli = []; // Svuota la lista per sicurezza
        }
      });
    } else {
      this.veicoliService.veicoli = []; // Se ID rimosso, svuota la lista
    }
  }

  selectVeicolo(targa: string): void {
    this.formData.targa = targa; // Imposta la targa cliccata nel form
  }

  submit(): void {
    if (!this.formData.targa) { // Controllo validità: targa obbligatoria
      this.errorMessage = "Seleziona un veicolo prima di inviare!";
      return;
    }

    this.loading = true; // Inizia animazione caricamento
    this.errorMessage = ''; // Pulisce errori

    const payload: sinistro = { // Prepara l'oggetto finale per il database
      targa: this.formData.targa,
      descrizione: this.formData.descrizione,
      data_evento: new Date(this.formData.data_evento), // Converte stringa in oggetto Date
      automobilista_id: Number(this.formData.automobilista_id) // Forza ID a numero
    };

    this.sinistriService.createSinistro(payload).subscribe({
      next: () => { // Se il database salva correttamente
        this.successMessage = "Sinistro registrato con successo!";
        setTimeout(() => { // Attesa estetica prima di chiudere
          this.created.emit(); // Segnala al padre di aggiornare la lista
          this.loading = false;
        }, 1500);
      },
      error: () => { // Se il salvataggio fallisce
        this.errorMessage = "Errore durante il salvataggio.";
        this.loading = false;
      }
    });
  }

  close(): void {
    this.closed.emit(); // Invia segnale di chiusura senza salvare
  }
}