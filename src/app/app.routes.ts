import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-component/login-component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register-component/register-component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home-component/home-component')
        .then(m => m.HomeComponent),
    children: [
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/home/perfil-component/perfil-component')
            .then(m => m.PerfilComponent)
      },
      {
        path: 'agendar',
        loadComponent: () =>
          import('./features/home/agendar-component/agendar-component')
            .then(m => m.AgendarComponent)
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/home/citas-component/citas-component')
            .then(m => m.CitasComponent)
      },
      {
        path: 'citas-medico',
        loadComponent: () =>
          import('./features/home/citas-medico-component/citas-medico-component')
            .then(m => m.CitasMedicoComponent)
      },
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];