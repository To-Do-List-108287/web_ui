import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {MatNativeDateModule} from "@angular/material/core";
import {authInterceptor} from "./interceptors/authInterceptor";
import {DatePipe} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ]),
    ),
    importProvidersFrom(MatNativeDateModule),
    DatePipe
  ]
};
