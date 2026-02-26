import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type UserRole = 'perito' | 'automobilista' | 'assicurazione';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './base.html',
  styleUrl: './base.css',
})
export class Base implements OnInit {
  sidebarOpen = false;

  userName = 'Leonardo Matta';
  userCode = 'P-9928';
  currentRole: UserRole = 'perito';

  get initials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get isAuthPage(): boolean {
    const authRoutes = ['/signin', '/signup'];
    return authRoutes.some(r => this.router.url.startsWith(r));
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Leggi il ruolo salvato (es. da localStorage o da un AuthService)
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      this.currentRole = savedRole;
    }
  }

  openSidebar(): void {
    this.sidebarOpen = true;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  switchRole(role: UserRole): void {
    this.currentRole = role;
    localStorage.setItem('userRole', role);

    // Naviga alla route corrispondente al ruolo
    const routeMap: Record<UserRole, string> = {
      perito: '/perito',
      automobilista: '/automobilista',
      assicurazione: '/assicurazione',
    };

    this.router.navigate([routeMap[role]]);
    this.closeSidebar();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/signin']);
    this.closeSidebar();
  }
}