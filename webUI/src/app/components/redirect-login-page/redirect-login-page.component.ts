import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-redirect-login-page',
  standalone: true,
  imports: [],
  templateUrl: './redirect-login-page.component.html',
  styleUrl: './redirect-login-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RedirectLoginPageComponent {
  authService : AuthService = inject(AuthService)

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    if (this.authService.isLoggedIn){
      console.log("navigating home")
      this.router.navigate(['home']);
      return
    }

    this.route.queryParams.subscribe(params => {
      const user_code = params['code'];
      if (user_code){
        this.authService.signIn(user_code);
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 3000);
      } else {
        this.router.navigate(['']);
      }
    });

  }

}
