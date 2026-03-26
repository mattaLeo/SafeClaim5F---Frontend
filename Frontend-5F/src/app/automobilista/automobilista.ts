import { Component, OnInit } from '@angular/core'; // Importa il nucleo del componente e l'interfaccia OnInit
import { CommonModule } from '@angular/common'; // Importa le direttive base di Angular come ngIf e ngFor
import { Router } from '@angular/router'; // Importa il servizio per la navigazione tra le pagine
import { FormsModule } from '@angular/forms'; // Importa il modulo per gestire i form e il binding [(ngModel)]
import { HttpClientModule } from '@angular/common/http'; // Importa il modulo per le chiamate API HTTP
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component'; // Importa il pezzo di interfaccia del popup
import { sinistro } from '../models/sinistro.model'; // Importa la definizione dati dell'oggetto sinistro
import { VeicoliService } from '../services/veicoli'; // Importa il servizio che gestisce i dati delle auto (MySQL)
import { Sinistri } from '../services/sinistri'; // Importa il servizio che gestisce i dati dei sinistri (MongoDB)

@Component({
  selector: 'app-automobilista', // Definisce il nome del tag HTML per usare questo componente
  standalone: true, // Specifica che il componente non ha bisogno di un modulo esterno (Angular moderno)
  imports: [CommonModule, NuovoSinistroComponent, FormsModule, HttpClientModule], // Elenca le dipendenze usate nel template
  templateUrl: './automobilista.html', // Collega il file HTML per la parte grafica
  styleUrl: './automobilista.css', // Collega il file CSS per lo stile
})
export class Automobilista implements OnInit {
  // Variabili di stato
  showNewSinistro = false; // Variabile booleana per mostrare o nascondere il popup del nuovo sinistro
  sinistri: sinistro[] = []; // Array che contiene la lista di tutti i sinistri recuperati dal database
  searchTerm: string = ''; // Stringa che memorizza il testo scritto dall'utente nella barra di ricerca

  constructor(
    public veicoliService: VeicoliService, // Iniezione del servizio veicoli (public per l'accesso diretto dall'HTML)
    private sinistriService: Sinistri, // Iniezione del servizio sinistri per le operazioni sui dati
    private router: Router // Iniezione del router per permettere lo spostamento tra le rotte
  ) {}

  ngOnInit(): void { // Metodo del ciclo di vita: viene eseguito all'avvio del componente
    // Sottoscrizione ai sinistri (Porta 7000)
    this.sinistriService.obsSinistri.subscribe({ // Si mette in ascolto del flusso di dati (Observable) dei sinistri
      next: (data: any) => { // Funzione eseguita quando arrivano nuovi dati con successo
        // Gestione flessibile della risposta (se array o oggetto con count/data)
        this.sinistri = Array.isArray(data) ? data : data.data || []; // Assegna i dati all'array
      },
      error: (err) => console.error("Errore caricamento sinistri:", err) // Gestisce eventuali errori di rete o del server
    });

    this.caricaDati(); // Richiama la funzione per popolare i dati iniziali
  }

  caricaDati() { // Funzione per inviare le richieste di caricamento ai servizi
    // Carica i sinistri da MongoDB
    this.sinistriService.askSinistri(); // Dice al servizio di fare la GET per scaricare i sinistri
    
    // Carica i veicoli da MySQL (Porta 5000)
    // Usiamo ID 1 perché il tuo script di setup ha creato utenti da 1 a 10
    const idTest = 1; // Imposta un ID di test fisso per recuperare i veicoli dell'utente 1
    this.veicoliService.askVeicoli(idTest).subscribe(); // Esegue la chiamata per i veicoli dell'utente selezionato
  }

  // Logica di ricerca sicura contro i valori null
  get sinistriFiltrati() { // Funzione "getter" che restituisce la lista filtrata in tempo reale
    if (!this.searchTerm.trim()) return this.sinistri; // Se la barra di ricerca è vuota, restituisce tutti i sinistri
    
    const search = this.searchTerm.toLowerCase(); // Converte il termine cercato in minuscolo per un confronto uniforme
    
    return this.sinistri.filter(s => { // Cicla ogni sinistro per vedere se corrisponde alla ricerca
      const targa = (s.targa ?? '').toString().toLowerCase(); // Prende la targa (gestendo valori nulli) e la rende minuscola
      const descrizione = (s.descrizione ?? '').toString().toLowerCase(); // Prende la descrizione e la rende minuscola
      return targa.includes(search) || descrizione.includes(search); // Verifica se la targa o la descrizione contengono il testo cercato
    });
  }

  // Metodi per l'interfaccia
  openNewSinistro() { // Funzione per aprire il popup
    this.showNewSinistro = true; // Imposta a true la variabile di controllo per mostrare il componente figlio
  }

  closeNewSinistro() { // Funzione per chiudere il popup
    this.showNewSinistro = false; // Imposta a false la variabile di controllo per nascondere il componente figlio
  }

  onCreated(nuovo: any) { // Funzione eseguita quando il componente figlio emette il segnale di "creazione avvenuta"
    this.caricaDati(); // Ricarica i dati dai database per mostrare il nuovo elemento appena inserito
    this.showNewSinistro = false; // Chiude automaticamente il popup dopo il successo
  }

  mostraDettagli(s: sinistro) { // Funzione per visualizzare i dettagli di un singolo record
    alert(`Dettagli Sinistro:\nTarga: ${s.targa}\nDescrizione: ${s.descrizione}`); // Mostra un semplice popup del browser con i dati
  }

  vaiAVeicoli() { // Funzione per navigare verso una pagina diversa
    this.router.navigate(['/veicoli']); // Usa il router per camfiare l'indirizzo URL dell'app
  }
} 