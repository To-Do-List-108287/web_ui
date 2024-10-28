import { Routes } from '@angular/router';
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {RedirectLoginPageComponent} from "./components/redirect-login-page/redirect-login-page.component";
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./guards/authGuard";

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'oauth2/idpresponse', component: RedirectLoginPageComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
];
