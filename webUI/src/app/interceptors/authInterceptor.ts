import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {throwError} from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService: AuthService = inject(AuthService);
  const authToken: String | null = authService.getToken();
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
  return next(newReq);
}
