import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Fondamentale per *ngIf e *ngFor
import { Router } from '@angular/router';
import { VeicoliService } from '../services/veicoli'; 

@Component({
  selector: 'app-lista-veicoli',
  standalone: true,
  // Aggiungiamo CommonModule qui per risolvere i warning NG8103
  imports: [CommonModule], 
  templateUrl: './lista-veicoli.html',
  styleUrl: './lista-veicoli.css'
})
export class ListaVeicoli implements OnInit {

  // Iniettando public veicoliService risolviamo l'errore nell'HTML
  constructor(
    public veicoliService: VeicoliService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carichiamo i dati all'apertura della pagina
    this.veicoliService.askVeicoli().subscribe();
  }

  // Questa funzione risolve l'errore del click sul tasto "Indietro"
  tornaAllaDashboard(): void {
    this.router.navigate(['/automobilista']);
  }
}