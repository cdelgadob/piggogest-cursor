import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ExpedientesComponent } from './components/expedientes/expedientes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'expedientes', component: ExpedientesComponent },
  { path: '**', redirectTo: '/login' }
];