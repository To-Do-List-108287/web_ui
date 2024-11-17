import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {environment} from "../../environments/environment";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService)
  const router: Router = inject(Router)

  authService.updateLoginStatus()
  if (!authService.isLoggedIn){
    window.location.href = environment.LOGIN_URL
    return false;
  }

  return true;
};
