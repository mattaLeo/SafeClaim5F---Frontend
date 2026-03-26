import { Component, OnInit } from '@angular/core'; // Importa il nucleo del componente e l'interfaccia del ciclo di vita
import { CommonModule } from '@angular/common'; // Importa le direttive standard (ngIf, ngFor) per il template
import { Router } from '@angular/router'; // Importa il servizio per gestire gli spostamenti tra le pagine
import { VeicoliService } from '../services/veicoli'; // Importa il servizio che comunica con il database MySQL (Porta 5000)
import { VeicoloItemComponent } from '../veicolo-item/veicolo-item'; // Importa il componente figlio che disegna la singola card

@Component({
  selector: 'app-lista-veicoli', // Definisce il tag HTML personalizzato per questo componente
  standalone: true, // Specifica che il componente è autonomo e gestisce le proprie importazioni
  imports: [CommonModule, VeicoloItemComponent], // Elenca i moduli e i componenti figli necessari al template
  templateUrl: './lista-veicoli.html', // Percorso del file HTML per la struttura visiva
  styleUrl: './lista-veicoli.css' // Percorso del file CSS per lo stile della pagina
})
export class ListaVeicoli implements OnInit {
  constructor(
    public veicoliService: VeicoliService, // Iniezione del servizio veicoli (public per l'accesso diretto dall'HTML)
    private router: Router // Iniezione del router per permettere la navigazione
  ) {}

  ngOnInit(): void { // Metodo che viene eseguito automaticamente alla creazione del componente
    this.caricaVeicoli(); // Avvia il recupero delle auto dal database
  }

  caricaVeicoli(): void { // Funzione per caricare i dati dei veicoli
    // Chiama il servizio passando l'ID 1 (test) e sottoscrive l'Observable per attivare la richiesta HTTP
    this.veicoliService.askVeicoli(1).subscribe(); 
  }

  tornaAllaDashboard(): void { // Funzione per la navigazione
    this.router.navigate(['/automobilista']); // Riporta l'utente alla schermata principale della Dashboard
  }
}