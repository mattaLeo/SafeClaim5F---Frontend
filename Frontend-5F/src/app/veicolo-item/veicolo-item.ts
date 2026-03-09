import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Veicolo } from '../models/veicolo.model';

@Component({
  selector: 'app-veicolo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veicolo-item.html'
})
export class VeicoloItem {
  @Input() veicolo!: Veicolo; // Riceve il veicolo dal padre
}