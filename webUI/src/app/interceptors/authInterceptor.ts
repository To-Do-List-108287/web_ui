import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {catchError, EMPTY, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const _snackBar = inject(MatSnackBar);
  const authService: AuthService = inject(AuthService);
  const authToken: string | null = authService.getToken();
  if (req.url.includes('api/auth/sign-in')) {
    return next(req);
  } else if (authToken === null) {
    authService.logout();
    return throwError(() => new HttpErrorResponse({
      status: 403,
      statusText: 'Unauthorized',
      error: { message: 'Authentication token is missing or expired.' }
    }));
  }
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`),
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        // Log out the user if the response is a 403 Forbidden
        authService.logout();
        _snackBar.open('Session expired. Please log in again.', 'Close', {
          duration: 2000,
          panelClass: ['warning_snackbar']
        });
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
}
