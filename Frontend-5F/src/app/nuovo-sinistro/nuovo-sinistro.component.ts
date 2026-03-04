import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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
export class NuovoSinistroComponent implements OnInit, OnDestroy {
  @Output() created = new EventEmitter<sinistro>();
  @Output() closed = new EventEmitter<void>();
  selectedVehicle: any = null;
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
    { targa: 'AA111BB', selected: false, modello: 'Fiat Panda' },
    { targa: 'CC222DD', selected: false, modello: 'Volkswagen Golf' },
    { targa: 'EE333FF', selected: false, modello: 'Renault Clio' },
    { targa: 'GG444HH', selected: false, modello: 'Ford Focus' },
    { targa: 'HH555II', selected: false, modello: 'Toyota Yaris' },
    { targa: 'JJ666KK', selected: false, modello: 'BMW Serie 3' },
    { targa: 'LL777MM', selected: false, modello: 'Audi A3' },
    { targa: 'NN888OO', selected: false, modello: 'Mercedes A' }
  ];

  constructor(private sinistri: Sinistri) {}

  ngOnInit(): void {
    // try to pull any existing sinistri (if the server is reachable)
    this.sinistri.askSinistri();
    // prevent background page from scrolling while modal is open
    try {
      document.body.style.overflow = 'hidden';
    } catch (e) {}
  }

  ngOnDestroy(): void {
    // restore body scroll when component is destroyed
    try {
      document.body.style.overflow = '';
    } catch (e) {}
  }

  selectVehicle(v: any) {
    // ensure only one selected at a time
    this.vehicles.forEach(x => (x.selected = false));
    v.selected = true;
    this.formData.targa = v.targa;
    this.selectedVehicle = v;
    console.log('selectVehicle called', v);
  }

  /**
   * Expose the service array so the template can iterate over it.
   * The array is mutated by the service when new items are created, so
   * change detection picks it up automatically.
   */
  get sinistriList(): sinistro[] {
    return this.sinistri.sinistri;
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

    const newSinistro: sinistro = {
      id_automobilista: this.formData.automobilista_id,
      targa: this.formData.targa,
      data_evento: evento,
      descrizione: this.formData.descrizione,
      stato: 'APERTO',
      data_creazione: new Date()
    };

    // The service already pushes the new sinistro into the shared array,
    // avoid pushing here to prevent duplicate entries.

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
          this.resetForm();
          this.created.emit(newSinistro);
        },
        error: (err: any) => {
          console.error('createSinistro failed', err);
          // mark simulation status so dashboard can render accordingly
          newSinistro.stato = 'SIMULAZIONE';
          this.errorMessage = err?.message ?? 'Errore durante la creazione.';
          this.resetForm();
          this.created.emit(newSinistro);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  close(): void {
    try { document.body.style.overflow = ''; } catch (e) {}
    this.closed.emit();
  }

  resetForm(): void {
    this.formData = { automobilista_id: 0, targa: '', data_evento: '', descrizione: '' };
    this.vehicles.forEach(v => (v.selected = false));
    this.selectedVehicle = null;
  }
}
