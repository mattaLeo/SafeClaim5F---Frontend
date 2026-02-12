import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perito.html',
  styleUrl: './perito.css',
})
export class Perito {
  user = { full_name: 'MARRO SIMONE', role: 'Automobilista' };
  activeTab: 'pending' | 'urgent' | 'completed' = 'pending';

  // Configurazione coerente con l'immagine
  statusConfig: any = {
    aperto: { label: 'Aperto', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
    in_assegnazione: { label: 'In Assegnazione', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    in_valutazione: { label: 'In Valutazione', color: 'bg-orange-50 text-orange-700 border-orange-100' },
    autorizzato: { label: 'Autorizzato', color: 'bg-green-50 text-green-700 border-green-100' }
  };

  allClaims = [
    {
      id: '1',
      claim_number: 'SN-88291-24',
      status: 'in_valutazione',
      priority: 'urgente',
      location_address: 'Via Giuseppe Verdi 15, 20121 Milano (MI)',
      claim_date: new Date(),
      inspection_date: new Date(),
      claim_type: 'Collisione tra veicoli',
      vehicle: 'Audi A3 - AB123CD'
    },
    {
      id: '2',
      claim_number: 'SN-77102-24',
      status: 'in_assegnazione',
      priority: 'normale',
      location_address: 'Corso Buenos Aires, Milano (MI)',
      claim_date: new Date(Date.now() - 86400000 * 3),
      claim_type: 'Danni da parcheggio',
      vehicle: 'Fiat 500 - EF456GH'
    }
  ];

  get filteredClaims() {
    if (this.activeTab === 'urgent') return this.allClaims.filter(c => c.priority === 'urgente');
    if (this.activeTab === 'completed') return this.allClaims.filter(c => c.status === 'autorizzato');
    return this.allClaims;
  }
}