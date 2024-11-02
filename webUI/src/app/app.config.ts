import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {authInterceptor} from "./interceptors/authInterceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    provideRouter(routes), provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ]),
    ),
    importProvidersFrom(MatNativeDateModule),
  ]
};
