import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { VeicoliService } from '../services/veicoli';
import { VeicoloItemComponent } from '../veicolo-item/veicolo-item'; 

@Component({
  selector: 'app-lista-veicoli',
  standalone: true,
  imports: [CommonModule, VeicoloItemComponent],
  templateUrl: './lista-veicoli.html',
  styleUrl: './lista-veicoli.css'
})
export class ListaVeicoli implements OnInit {
  constructor(
    public veicoliService: VeicoliService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caricaVeicoli();
  }

  caricaVeicoli(): void {
    this.veicoliService.askVeicoli(1).subscribe();
  }

  tornaAllaDashboard(): void {
    this.router.navigate(['/automobilista']);
  }
}