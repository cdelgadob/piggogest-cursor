import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <header class="header">
      <div class="header-content">
        <h1>Admin UI - Piggogest</h1>
        <nav>
          <a routerLink="/login" class="nav-link">Login</a>
          <a routerLink="/expedientes" class="nav-link">Expedientes</a>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .nav-link {
      color: white;
      text-decoration: none;
      margin-left: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .main-content {
      min-height: calc(100vh - 80px);
    }
  `]
})
export class AppComponent {}