import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>
    <nav>
      <a routerLink="/groups">Manage Groups</a>
      <a routerLink="/channels">Manage Channels</a>
      <a routerLink="/users">Manage Users</a>
    </nav>
  `
})
export class DashboardComponent { }
