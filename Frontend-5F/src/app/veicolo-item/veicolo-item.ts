import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-veicolo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veicolo-item.html', // Corretto: punta a veicolo-item.html
  styleUrl: './veicolo-item.css'    // Corretto: punta a veicolo-item.css
})
export class VeicoloItemComponent {
  @Input() veicolo: any;
}