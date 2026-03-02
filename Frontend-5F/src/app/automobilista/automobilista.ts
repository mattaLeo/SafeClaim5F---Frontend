import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuovoSinistroComponent } from '../nuovo-sinistro/nuovo-sinistro.component';
import { sinistro } from '../models/sinistro.model';

@Component({
  selector: 'app-automobilista',
  standalone: true,
  imports: [CommonModule, NuovoSinistroComponent],
  templateUrl: './automobilista.html',
  styleUrl: './automobilista.css',
})
export class Automobilista {
  showNewSinistro = false;
  sinistri: sinistro[] = [];

  openNewSinistro(): void {
    this.showNewSinistro = true;
  }

  onCreated(s: sinistro): void {
    // add the sinistro to the list
    this.sinistri.push(s);
  }

  closeNewSinistro(): void {
    this.showNewSinistro = false;
  }


}

