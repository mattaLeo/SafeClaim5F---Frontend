import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

// Import del componente per il popup dei sinistri
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component';

import { sinistro } from '../models/sinistro.model';
import { VeicoliService } from '../services/veicoli'; 
import { Sinistri } from '../services/sinistri'; 

@Component({
  selector: 'app-automobilista',
  standalone: true,
  imports: [CommonModule, NuovoSinistroComponent, FormsModule, HttpClientModule],
  templateUrl: './automobilista.html',
  styleUrl: './automobilista.css',
})
export class Automobilista implements OnInit {
  // Variabili di stato
  showNewSinistro = false;
  sinistri: sinistro[] = [];
  searchTerm: string = ''; 

  constructor(
    public veicoliService: VeicoliService, 
    private sinistriService: Sinistri, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sottoscrizione ai sinistri (Porta 7000)
    this.sinistriService.obsSinistri.subscribe({
      next: (data: any) => {
        // Gestione flessibile della risposta (se array o oggetto con count/data)
        this.sinistri = Array.isArray(data) ? data : data.data || [];
      },
      error: (err) => console.error("Errore caricamento sinistri:", err)
    });

    this.caricaDati();
  }

  caricaDati() {
    // Carica i sinistri da MongoDB
    this.sinistriService.askSinistri();
    
    // Carica i veicoli da MySQL (Porta 5000)
    // Usiamo ID 1 perché il tuo script di setup ha creato utenti da 1 a 10
    const idTest = 1; 
    this.veicoliService.askVeicoli(idTest).subscribe(); 
  }

  // Logica di ricerca sicura contro i valori null
  get sinistriFiltrati() {
    if (!this.searchTerm.trim()) return this.sinistri;
    
    const search = this.searchTerm.toLowerCase();
    
    return this.sinistri.filter(s => {
      const targa = (s.targa ?? '').toString().toLowerCase();
      const descrizione = (s.descrizione ?? '').toString().toLowerCase();
      return targa.includes(search) || descrizione.includes(search);
    });
  }

  // Metodi per l'interfaccia
  openNewSinistro() {
    this.showNewSinistro = true;
  }

  closeNewSinistro() {
    this.showNewSinistro = false;
  }

  onCreated(nuovo: any) {
    this.caricaDati();
    this.showNewSinistro = false;
  }

  mostraDettagli(s: sinistro) {
    alert(`Dettagli Sinistro:\nTarga: ${s.targa}\nDescrizione: ${s.descrizione}`);
  }

  vaiAVeicoli() {
    this.router.navigate(['/veicoli']);
  }
}   