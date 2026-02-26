import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimCardComponent } from '../componenti/claim-card/claim-card.component';

export type ViewType = 'dashboard' | 'archivio' | 'calendario';
// perito.ts
export type VehicleType = 'car' | 'truck' | 'motorcycle' | 'van' | 'suv';
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
  imports: [CommonModule, FormsModule, ClaimCardComponent],
  templateUrl: './perito.html',
  styleUrl: './perito.css',
})
export class Perito implements OnInit {
  isSidebarOpen = false;
  isSettingsOpen = false;
  isContactModalOpen = false;
  isSettingsAnimating = false;
  isClaimDetailOpen = false;
  selectedClaim: Claim | null = null;
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

  contactForm = {
    insurance: '',
    subject: '',
    priority: 'normale',
    message: '',
    claimCode: ''
  };
  contactSent = false;

  calendarYear = 2026;
  calendarMonth = 1;
  selectedDay: number | null = null;

  monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  filterStatus = '';
  filterType = '';
  filterMonth = '';
  filterPriority = '';
  filterSearch = '';

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
      date: '22 Febbraio 2026', time: '08:30', vehicle: 'Ducati Monster - UV345WX',
      priority: 'alta', insuranceCompany: 'Generali', amount: 9200, month: 2, year: 2026
    },
    {
      id: '21', code: 'SN-44120-24', status: 'in_attesa',
      type: 'Collisione Laterale', location: 'Via Novara 11, Milano',
      date: '23 Febbraio 2026', time: '10:00', vehicle: 'Iveco Daily - RR901ZZ',
      priority: 'media', insuranceCompany: 'AXA', amount: 6700, month: 2, year: 2026
    },
    {
      id: '22', code: 'SN-33880-24', status: 'assegnato',
      type: 'Danno da Grandine', location: 'Piazza Duca d\'Aosta, Milano',
      date: '24 Febbraio 2026', time: '13:30', vehicle: 'Volkswagen Transporter - PP567HH',
      priority: 'bassa', insuranceCompany: 'UnipolSai', amount: 2300, month: 2, year: 2026
    },
  ];

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
      date: '08 Dicembre 2025', time: '08:00', vehicle: 'Yamaha MT-07 - ST123UV',
      priority: 'alta', insuranceCompany: 'AXA', amount: 7400, month: 12, year: 2025
    },
    {
      id: '12', code: 'SN-77210-23', status: 'chiuso',
      type: 'Tamponamento', location: 'Corso Garibaldi 55, Firenze',
      date: '12 Dicembre 2025', time: '13:00', vehicle: 'Scania R450 - WX456YZ',
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
      date: '25 Novembre 2025', time: '10:30', vehicle: 'Ford Transit - EF012GH',
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
      date: '22 Settembre 2025', time: '08:00', vehicle: 'Harley-Davidson - UV234WX',
      priority: 'bassa', insuranceCompany: 'Generali', amount: 2600, month: 9, year: 2025
    },
    {
      id: '19', code: 'SN-99877-23', status: 'approvato',
      type: 'Collisione Catena', location: 'Tangenziale Est, Milano',
      date: '05 Agosto 2025', time: '07:30', vehicle: 'MAN TGX - YZ567AB',
      priority: 'alta', insuranceCompany: 'AXA', amount: 8900, month: 8, year: 2025
    },
    {
      id: '20', code: 'SN-88745-23', status: 'chiuso',
      type: 'Incendio Parziale', location: 'Via Sempione 12, Milano',
      date: '15 Agosto 2025', time: '19:00', vehicle: 'Land Rover Discovery - CD890EF',
      priority: 'alta', insuranceCompany: 'UnipolSai', amount: 14300, month: 8, year: 2025
    },
  ];

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

  roles = ['Perito', 'Automobilista', 'Assicurazione', 'Officina', 'Supporto Stradale'];

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

  goHome() {
    this.currentView = 'dashboard';
    this.isSidebarOpen = false;
    this.isSettingsOpen = false;
    this.isClaimDetailOpen = false;
    this.isContactModalOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openSettings() {
    this.isSidebarOpen = false;
    this.isSettingsOpen = true;
    // Piccolo delay solo per triggerare l'animazione CSS dopo il render
    setTimeout(() => { this.isSettingsAnimating = true; }, 16);
  }

  closeSettings() {
    this.isSettingsAnimating = false;
    setTimeout(() => { this.isSettingsOpen = false; }, 350);
  }

  openClaimDetail(claim: Claim) {
    this.selectedClaim = claim;
    this.isClaimDetailOpen = true;
  }

  closeClaimDetail() {
    this.isClaimDetailOpen = false;
    setTimeout(() => { this.selectedClaim = null; }, 350);
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
    this.contactSent = true;
    setTimeout(() => { this.closeContactModal(); }, 2000);
  }

  switchRole(role: string) {
    this.currentRole = role;
  }

  // ─── Vehicle type detection ───────────────────────────────────────────────

  getVehicleType(vehicle: string): VehicleType {
    const v = vehicle.toLowerCase();

    const motorcycleBrands = [
      'ducati', 'yamaha', 'kawasaki', 'suzuki moto', 'harley', 'honda cb',
      'honda cbr', 'honda sh', 'ktm', 'aprilia', 'triumph', 'bmw r', 'bmw gs',
      'bmw f', 'moto guzzi', 'royal enfield', 'benelli', 'mv agusta', 'piaggio',
      'vespa', 'kymco', 'sym moto', 'cfmoto', 'husqvarna', 'beta moto', 'ktm'
    ];
    if (motorcycleBrands.some(b => v.includes(b))) return 'motorcycle';

    const truckBrands = [
      'iveco', 'scania', 'man ', 'daf ', 'volvo fh', 'volvo fm', 'mercedes actros',
      'mercedes arocs', 'renault truck', 'renault t ', 'kenworth', 'peterbilt',
      'mercedes atego', 'man tgx', 'man tgs', 'man tgl'
    ];
    if (truckBrands.some(b => v.includes(b))) return 'truck';

    const vanKeywords = [
      'transporter', 'transit', 'sprinter', 'ducato', 'master', 'jumper',
      'vito', 'crafter', 'boxer', 'daily', 'trafic', 'expert', 'vivan',
      'berlingo cargo', 'combo cargo', 'kangoo', 'caddy cargo'
    ];
    if (vanKeywords.some(b => v.includes(b))) return 'van';

    const suvKeywords = [
      'suv', 'qashqai', 'tucson', 'sportage', 'tiguan', 'rav4', 'cr-v',
      'x5', 'x3', 'x1', 'xc60', 'xc40', 'discovery', 'freelander', 'defender',
      'renegade', 'compass', 'gla', 'glb', 'glc', 'gle', 'mokka', 'grandland',
      'captur', 'puma ford', 'kuga', 'ecosport', 'arona', 'ateca', 'karoq',
      'kodiaq', 'yaris cross', 'corolla cross', 'ux lexus', 'rx lexus',
      'ix35', 'ix55', 'santa fe'
    ];
    if (suvKeywords.some(b => v.includes(b))) return 'suv';

    return 'car';
  }

  // ─── Calendar ─────────────────────────────────────────────────────────────

  get calendarDays(): (number | null)[] {
    const firstDay = new Date(this.calendarYear, this.calendarMonth, 1).getDay();
    const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();
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

  // ─── Archive filters ──────────────────────────────────────────────────────

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

  // ─── Status / Priority helpers ────────────────────────────────────────────

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
      'in_valutazione': 'bg-orange-50 text-orange-700 border-orange-200',
      'assegnato':      'bg-blue-50 text-blue-700 border-blue-200',
      'chiuso':         'bg-slate-50 text-slate-500 border-slate-200',
      'in_attesa':      'bg-yellow-50 text-yellow-700 border-yellow-100',
      'approvato':      'bg-green-50 text-green-700 border-green-200'
    };
    return map[status] || 'bg-slate-50 text-slate-500 border-slate-200';
  }

  getPriorityClass(p: string): string {
    const map: Record<string, string> = {
      'alta':  'bg-red-50 text-rose-600',
      'media': 'bg-orange-50 text-orange-600',
      'bassa': 'bg-green-50 text-green-600'
    };
    return map[p] || '';
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      'Perito':           'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'Automobilista':    'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h5',
      'Assicurazione':    'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
      'Officina':         'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'Supporto Stradale':'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
    };
    return icons[role] || icons['Perito'];
  }

  get totalArchiveAmount(): number {
    return this.filteredClaims.reduce((s, c) => s + (c.amount || 0), 0);
  }
}