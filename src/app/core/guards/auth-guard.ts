import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

/**
 * Guard de autenticación para proteger rutas privadas de la aplicación.
 *
 * Intercepta la navegación hacia cualquier ruta protegida y verifica
 * la existencia de un JWT válido en localStorage. Si no existe token,
 * redirige al usuario a la pantalla de login.
 *
 * Se aplica a todas las rutas bajo `/home` en `app.routes.ts`.
 *
 * @returns `true` si el usuario está autenticado y puede acceder a la ruta.
 *          `false` + redirección a `/login` si no hay sesión activa.
 */
export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
