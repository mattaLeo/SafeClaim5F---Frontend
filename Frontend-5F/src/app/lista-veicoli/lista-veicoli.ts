import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { VeicoliService } from '../services/veicoli'; 
// 1. Importa il componente figlio
import { VeicoloItem } from '../veicolo-item/veicolo-item'; 

@Component({
  selector: 'app-lista-veicoli',
  standalone: true,
  // 2. Aggiungi VeicoloItem qui dentro
  imports: [CommonModule, VeicoloItem], 
  templateUrl: './lista-veicoli.html',
  styleUrl: './lista-veicoli.css'
})
export class ListaVeicoli implements OnInit {

  constructor(
    public veicoliService: VeicoliService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carichiamo i dati all'apertura della pagina
    this.veicoliService.askVeicoli().subscribe();
  }

  tornaAllaDashboard(): void {
    this.router.navigate(['/automobilista']);
  }
}