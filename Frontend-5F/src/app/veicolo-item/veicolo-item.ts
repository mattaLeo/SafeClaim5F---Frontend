import { Component, Input } from '@angular/core'; // Importa Input per ricevere dati dal componente padre
import { CommonModule } from '@angular/common'; // Importa le funzionalità base di Angular

@Component({
  selector: 'app-veicolo-item', // Nome del tag HTML usato dentro la ListaVeicoli
  standalone: true, // Indica che il componente non dipende da moduli esterni
  imports: [CommonModule], // Moduli necessari per il funzionamento (es. pipe o direttive)
  templateUrl: './veicolo-item.html', // File che definisce la grafica della singola card
  styleUrl: './veicolo-item.css'    // File che definisce lo stile CSS della card
})
export class VeicoloItemComponent {
  // @Input() è il "tunnel" che permette al padre di passare l'oggetto veicolo a questo figlio
  @Input() veicolo: any; 
} 