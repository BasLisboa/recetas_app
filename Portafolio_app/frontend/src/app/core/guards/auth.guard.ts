import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // accedes a tu servicio
  const router = inject(Router);           // accedes al router

  // Llamas a un método del servicio que retorna true/false
  if (authService.isAuthenticated()) {
    return true; // deja pasar
  } else {
    // redirige al login si no está logueado
    return router.createUrlTree(['/auth/login']);
  }
};

