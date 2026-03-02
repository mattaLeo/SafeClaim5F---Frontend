import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sinistri } from '../services/sinistri';
import { sinistro } from '../models/sinistro.model';

@Component({
  selector: 'app-nuovo-sinistro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuovo-sinistro.component.html',
  styleUrl: './nuovo-sinistro.component.css',
})
export class NuovoSinistroComponent {
  @Output() created = new EventEmitter<sinistro>();
  @Output() closed = new EventEmitter<void>();
  // form model bound with ngModel
  formData = {
    automobilista_id: 0,
    targa: '',
    data_evento: '',
    descrizione: '',
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  // sample list of vehicles to choose from
  vehicles = [
    { targa: 'AA111BB', selected: false },
    { targa: 'CC222DD', selected: false },
    { targa: 'EE333FF', selected: false },
    { targa: 'GG444HH', selected: false },
  ];

  constructor(private sinistri: Sinistri) {}

  selectVehicle(v: any) {
    // ensure only one selected at a time
    this.vehicles.forEach(x => (x.selected = false));
    v.selected = true;
    this.formData.targa = v.targa;
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // basic validation
    if (
      !this.formData.automobilista_id ||
      !this.formData.targa ||
      !this.formData.data_evento ||
      !this.formData.descrizione
    ) {
      this.errorMessage = 'Completa tutti i campi.';
      return;
    }

    const evento = new Date(this.formData.data_evento);

    this.loading = true;
    // the service now returns an observable
    this.sinistri
      .createSinistro(
        this.formData.automobilista_id,
        this.formData.targa,
        evento,
        this.formData.descrizione
      )
      .subscribe({
        next: _ => {
          this.successMessage = 'Sinistro creato con successo.';
          const newSinistro: sinistro = {
            id_automobilista: this.formData.automobilista_id,
            targa: this.formData.targa,
            data_evento: evento,
            descrizione: this.formData.descrizione,
            stato: 'APERTO',
            data_creazione: new Date()
          };
          this.resetForm();
          this.created.emit(newSinistro);
        },
        error: (err: any) => {
          this.errorMessage = err?.message ?? 'Errore durante la creazione.';
          
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  close(): void {
    this.closed.emit();
  }

  resetForm(): void {
    this.formData = { automobilista_id: 0, targa: '', data_evento: '', descrizione: '' };
    this.vehicles.forEach(v => (v.selected = false));
  }
}
