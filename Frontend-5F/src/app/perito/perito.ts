import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ViewType = 'dashboard' | 'archivio' | 'calendario';

export interface Claim {
  id: string;
  code: string;
  status: 'in_valutazione' | 'assegnato' | 'chiuso' | 'in_attesa' | 'approvato';
  type: string;
  location: string;
  date: string;
  time: string;
  vehicle: string;
  priority: 'alta' | 'media' | 'bassa';
  insuranceCompany: string;
  amount?: number;
  month: number;
  year: number;
}

export interface UserSettings {
  full_name: string;
  email: string;
  phone: string;
  notifications_email: boolean;
  notifications_sms: boolean;
  language: string;
  theme: string;
}

@Component({
  selector: 'app-perito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perito.html',
  styleUrl: './perito.css',
})
export class Perito implements OnInit {
  isSidebarOpen = false;
  isSettingsOpen = false;
  isContactModalOpen = false;
  isSettingsAnimating = false;
  currentRole = 'Perito';
  currentView: ViewType = 'dashboard';

  user = {
    full_name: 'MARRO SIMONE',
    email: 'simone.marro@safeclaim.it',
    id: 'P-9928'
  };

  settings: UserSettings = {
    full_name: 'MARRO SIMONE',
    email: 'simone.marro@safeclaim.it',
    phone: '+39 335 7821094',
    notifications_email: true,
    notifications_sms: false,
    language: 'Italiano',
    theme: 'Chiaro'
  };

  settingsSaved = false;

  // Contact insurance form
  contactForm = {
    insurance: '',
    subject: '',
    priority: 'normale',
    message: '',
    claimCode: ''
  };
  contactSent = false;

  // Calendar state
  calendarYear = 2026;
  calendarMonth = 1; // 0-indexed: 1 = February
  selectedDay: number | null = null;

  monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  // Archive filters
  filterStatus = '';
  filterType = '';
  filterMonth = '';
  filterPriority = '';
  filterSearch = '';

  // Pending claims (dashboard)
  claims: Claim[] = [
    {
      id: '1', code: 'SN-88291-24', status: 'in_valutazione',
      type: 'Collisione Catena', location: 'Via Giuseppe Verdi 15, Milano',
      date: '18 Febbraio 2026', time: '14:30', vehicle: 'Audi A3 - AB123CD',
      priority: 'alta', insuranceCompany: 'Generali', amount: 3400, month: 2, year: 2026
    },
    {
      id: '2', code: 'SN-77102-24', status: 'assegnato',
      type: 'Danno da Grandine', location: 'Corso Buenos Aires, Milano',
      date: '19 Febbraio 2026', time: '09:00', vehicle: 'Fiat 500 - EF456GH',
      priority: 'media', insuranceCompany: 'AXA', amount: 1200, month: 2, year: 2026
    },
    {
      id: '3', code: 'SN-91034-24', status: 'in_valutazione',
      type: 'Tamponamento', location: 'Viale Monza 88, Milano',
      date: '20 Febbraio 2026', time: '11:15', vehicle: 'BMW Serie 3 - MN789OP',
      priority: 'alta', insuranceCompany: 'UnipolSai', amount: 5600, month: 2, year: 2026
    },
    {
      id: '4', code: 'SN-66543-24', status: 'assegnato',
      type: 'Furto Parziale', location: 'Via Torino 22, Milano',
      date: '21 Febbraio 2026', time: '16:00', vehicle: 'Mercedes GLA - QR012ST',
      priority: 'bassa', insuranceCompany: 'Allianz', amount: 800, month: 2, year: 2026
    },
    {
      id: '5', code: 'SN-55210-24', status: 'in_valutazione',
      type: 'Incendio Parziale', location: 'Via Padova 5, Milano',
      date: '22 Febbraio 2026', time: '08:30', vehicle: 'Volkswagen Golf - UV345WX',
      priority: 'alta', insuranceCompany: 'Generali', amount: 9200, month: 2, year: 2026
    },
  ];

  // Full archive
  allClaims: Claim[] = [
    ...this.claims,
    {
      id: '6', code: 'SN-44891-24', status: 'chiuso',
      type: 'Collisione Laterale', location: 'Via Dante 3, Torino',
      date: '10 Gennaio 2026', time: '10:00', vehicle: 'Toyota Yaris - YZ678AB',
      priority: 'media', insuranceCompany: 'Generali', amount: 2100, month: 1, year: 2026
    },
    {
      id: '7', code: 'SN-33781-24', status: 'approvato',
      type: 'Danno da Grandine', location: 'Corso Vittorio, Torino',
      date: '12 Gennaio 2026', time: '14:00', vehicle: 'Renault Clio - CD901EF',
      priority: 'bassa', insuranceCompany: 'AXA', amount: 780, month: 1, year: 2026
    },
    {
      id: '8', code: 'SN-22654-24', status: 'approvato',
      type: 'Tamponamento', location: 'Via Roma 99, Bologna',
      date: '15 Gennaio 2026', time: '09:30', vehicle: 'Peugeot 308 - GH234IJ',
      priority: 'media', insuranceCompany: 'UnipolSai', amount: 3300, month: 1, year: 2026
    },
    {
      id: '9', code: 'SN-11523-24', status: 'chiuso',
      type: 'Furto Totale', location: 'Via Indipendenza 7, Bologna',
      date: '18 Gennaio 2026', time: '11:00', vehicle: 'Honda Civic - KL567MN',
      priority: 'alta', insuranceCompany: 'Allianz', amount: 18000, month: 1, year: 2026
    },
    {
      id: '10', code: 'SN-99410-23', status: 'chiuso',
      type: 'Vandalismo', location: 'Via Manzoni 14, Firenze',
      date: '05 Dicembre 2025', time: '15:30', vehicle: 'Ford Focus - OP890QR',
      priority: 'bassa', insuranceCompany: 'Generali', amount: 650, month: 12, year: 2025
    },
    {
      id: '11', code: 'SN-88334-23', status: 'approvato',
      type: 'Collisione Frontale', location: 'Viale Europa 23, Firenze',
      date: '08 Dicembre 2025', time: '08:00', vehicle: 'Opel Mokka - ST123UV',
      priority: 'alta', insuranceCompany: 'AXA', amount: 7400, month: 12, year: 2025
    },
    {
      id: '12', code: 'SN-77210-23', status: 'chiuso',
      type: 'Tamponamento', location: 'Corso Garibaldi 55, Firenze',
      date: '12 Dicembre 2025', time: '13:00', vehicle: 'Nissan Qashqai - WX456YZ',
      priority: 'media', insuranceCompany: 'UnipolSai', amount: 1900, month: 12, year: 2025
    },
    {
      id: '13', code: 'SN-66098-23', status: 'chiuso',
      type: 'Incendio Totale', location: 'Via Nazionale 8, Napoli',
      date: '20 Novembre 2025', time: '17:00', vehicle: 'Kia Sportage - AB789CD',
      priority: 'alta', insuranceCompany: 'Allianz', amount: 22000, month: 11, year: 2025
    },
    {
      id: '14', code: 'SN-55873-23', status: 'approvato',
      type: 'Danno da Alluvione', location: 'Via Toledo 40, Napoli',
      date: '25 Novembre 2025', time: '10:30', vehicle: 'Hyundai Tucson - EF012GH',
      priority: 'alta', insuranceCompany: 'Generali', amount: 11500, month: 11, year: 2025
    },
    {
      id: '15', code: 'SN-44651-23', status: 'chiuso',
      type: 'Collisione Laterale', location: 'Viale Campania 77, Roma',
      date: '03 Ottobre 2025', time: '09:00', vehicle: 'Seat Ibiza - IJ345KL',
      priority: 'bassa', insuranceCompany: 'AXA', amount: 1400, month: 10, year: 2025
    },
    {
      id: '16', code: 'SN-33420-23', status: 'approvato',
      type: 'Furto Parziale', location: 'Via Appia 120, Roma',
      date: '10 Ottobre 2025', time: '16:00', vehicle: 'Skoda Octavia - MN678OP',
      priority: 'media', insuranceCompany: 'UnipolSai', amount: 3200, month: 10, year: 2025
    },
    {
      id: '17', code: 'SN-22199-23', status: 'chiuso',
      type: 'Tamponamento', location: 'Via Ostiense 55, Roma',
      date: '18 Settembre 2025', time: '12:30', vehicle: 'Alfa Romeo Giulia - QR901ST',
      priority: 'media', insuranceCompany: 'Allianz', amount: 4800, month: 9, year: 2025
    },
    {
      id: '18', code: 'SN-11088-23', status: 'chiuso',
      type: 'Danno da Grandine', location: 'Corso Lodi 33, Milano',
      date: '22 Settembre 2025', time: '08:00', vehicle: 'Volvo XC60 - UV234WX',
      priority: 'bassa', insuranceCompany: 'Generali', amount: 2600, month: 9, year: 2025
    },
    {
      id: '19', code: 'SN-99877-23', status: 'approvato',
      type: 'Collisione Catena', location: 'Tangenziale Est, Milano',
      date: '05 Agosto 2025', time: '07:30', vehicle: 'Jeep Renegade - YZ567AB',
      priority: 'alta', insuranceCompany: 'AXA', amount: 8900, month: 8, year: 2025
    },
    {
      id: '20', code: 'SN-88745-23', status: 'chiuso',
      type: 'Incendio Parziale', location: 'Via Sempione 12, Milano',
      date: '15 Agosto 2025', time: '19:00', vehicle: 'Land Rover Discovery - CD890EF',
      priority: 'alta', insuranceCompany: 'UnipolSai', amount: 14300, month: 8, year: 2025
    },
  ];

  // Calendar appointments
  appointments: { day: number; time: string; title: string; location: string; claimCode: string }[] = [
    { day: 18, time: '14:30', title: 'Perizia Audi A3', location: 'Via Verdi 15, Milano', claimCode: 'SN-88291-24' },
    { day: 19, time: '09:00', title: 'Perizia Fiat 500', location: 'Corso Buenos Aires, Milano', claimCode: 'SN-77102-24' },
    { day: 20, time: '11:15', title: 'Perizia BMW Serie 3', location: 'Viale Monza 88, Milano', claimCode: 'SN-91034-24' },
    { day: 21, time: '16:00', title: 'Perizia Mercedes GLA', location: 'Via Torino 22, Milano', claimCode: 'SN-66543-24' },
    { day: 22, time: '08:30', title: 'Perizia VW Golf', location: 'Via Padova 5, Milano', claimCode: 'SN-55210-24' },
    { day: 25, time: '10:00', title: 'Riunione Generali', location: 'Piazza Cordusio, Milano', claimCode: '' },
    { day: 27, time: '15:00', title: 'Sopralluogo straordinario', location: 'Via Sarpi 9, Milano', claimCode: '' },
  ];

  insuranceCompanies = ['Generali', 'AXA', 'UnipolSai', 'Allianz', 'Poste Assicura', 'Zurich'];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('perito_settings');
    if (saved) {
      this.settings = JSON.parse(saved);
      this.user.full_name = this.settings.full_name;
    }
  }

  saveSettings() {
    localStorage.setItem('perito_settings', JSON.stringify(this.settings));
    this.user.full_name = this.settings.full_name;
    this.user.email = this.settings.email;
    this.settingsSaved = true;
    setTimeout(() => { this.settingsSaved = false; }, 2500);
  }

  setView(view: ViewType) {
    this.currentView = view;
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openSettings() {
    this.isSidebarOpen = false;
    this.isSettingsAnimating = false;
    setTimeout(() => {
      this.isSettingsOpen = true;
      setTimeout(() => { this.isSettingsAnimating = true; }, 20);
    }, 100);
  }

  closeSettings() {
    this.isSettingsAnimating = false;
    setTimeout(() => { this.isSettingsOpen = false; }, 350);
  }

  openContactModal(claimCode = '') {
    this.contactForm.claimCode = claimCode;
    this.contactSent = false;
    this.isContactModalOpen = true;
  }

  closeContactModal() {
    this.isContactModalOpen = false;
    this.contactSent = false;
  }

  sendContactForm() {
    // Simulate sending
    this.contactSent = true;
    setTimeout(() => { this.closeContactModal(); }, 2000);
  }

  switchRole(role: string) {
    this.currentRole = role;
  }

  // Calendar methods
  get calendarDays(): (number | null)[] {
    const firstDay = new Date(this.calendarYear, this.calendarMonth, 1).getDay();
    const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();
    // Adjust: Monday = 0
    const offset = (firstDay + 6) % 7;
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }

  prevMonth() {
    if (this.calendarMonth === 0) { this.calendarMonth = 11; this.calendarYear--; }
    else this.calendarMonth--;
    this.selectedDay = null;
  }

  nextMonth() {
    if (this.calendarMonth === 11) { this.calendarMonth = 0; this.calendarYear++; }
    else this.calendarMonth++;
    this.selectedDay = null;
  }

  hasAppointment(day: number | null): boolean {
    if (!day) return false;
    return this.appointments.some(a =>
      a.day === day && this.calendarMonth === 1 && this.calendarYear === 2026
    );
  }

  getAppointmentsForDay(day: number): typeof this.appointments {
    return this.appointments.filter(a =>
      a.day === day && this.calendarMonth === 1 && this.calendarYear === 2026
    );
  }

  selectDay(day: number | null) {
    if (!day) return;
    this.selectedDay = this.selectedDay === day ? null : day;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    return day === 18 && this.calendarMonth === 1 && this.calendarYear === 2026;
  }

  // Archive filter methods
  get filteredClaims(): Claim[] {
    return this.allClaims.filter(c => {
      if (this.filterStatus && c.status !== this.filterStatus) return false;
      if (this.filterType && !c.type.toLowerCase().includes(this.filterType.toLowerCase())) return false;
      if (this.filterPriority && c.priority !== this.filterPriority) return false;
      if (this.filterMonth && c.month !== parseInt(this.filterMonth)) return false;
      if (this.filterSearch) {
        const s = this.filterSearch.toLowerCase();
        if (!c.code.toLowerCase().includes(s) &&
          !c.location.toLowerCase().includes(s) &&
          !c.vehicle.toLowerCase().includes(s) &&
          !c.insuranceCompany.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }

  resetFilters() {
    this.filterStatus = '';
    this.filterType = '';
    this.filterMonth = '';
    this.filterPriority = '';
    this.filterSearch = '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'in_valutazione': 'In Valutazione',
      'assegnato': 'Assegnato',
      'chiuso': 'Chiuso',
      'in_attesa': 'In Attesa',
      'approvato': 'Approvato'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'in_valutazione': 'badge-orange',
      'assegnato': 'badge-blue',
      'chiuso': 'badge-gray',
      'in_attesa': 'badge-yellow',
      'approvato': 'badge-green'
    };
    return map[status] || 'badge-gray';
  }

  getPriorityClass(p: string): string {
    const map: Record<string, string> = { 'alta': 'prio-alta', 'media': 'prio-media', 'bassa': 'prio-bassa' };
    return map[p] || '';
  }

  get totalArchiveAmount(): number {
    return this.filteredClaims.reduce((s, c) => s + (c.amount || 0), 0);
  }
}