import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>🔐 Admin UI - Piggogest</h2>
          <p>Inicia sesión para acceder al sistema</p>
        </div>
        
        <div class="login-content">
          <button 
            class="login-button"
            (click)="login()">
            Iniciar Sesión (Demo)
          </button>
          
          <p class="demo-note">
            <small>Nota: Esta es una versión demo sin Auth0 configurado</small>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      margin: 1rem;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .login-header h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }
    
    .login-header p {
      margin: 0;
      color: #666;
    }
    
    .login-content {
      text-align: center;
    }
    
    .login-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      width: 100%;
    }
    
    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .demo-note {
      margin-top: 1rem;
      color: #888;
    }
  `]
})
export class LoginComponent {
  constructor(private router: Router) {}

  login() {
    // Demo login - just navigate to expedientes
    this.router.navigate(['/expedientes']);
  }
}