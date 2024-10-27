import { Routes } from '@angular/router';
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {RedirectLoginPageComponent} from "./redirect-login-page/redirect-login-page.component";

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'oauth2/idpresponse', component: RedirectLoginPageComponent},
];
