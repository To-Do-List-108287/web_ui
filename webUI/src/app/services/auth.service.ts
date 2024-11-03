import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SignInResponse} from "../models/SignInResponse";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient)
  private baseURL : string = environment.API_URL + "auth/";
  isLoggedIn!: boolean;

  constructor(private router: Router) {
    this.updateLoginStatus()
  }

  updateLoginStatus() : void {
    const token: string | null = localStorage.getItem("token")
    if (token===null) {
      this.isLoggedIn = false;
    } else {
      // if jwt token is invalid (maybe user changed local storage)
      // the exception will have to be caught outside the function
      // this.userId = this.helper.decodeToken(access).user_id;
      this.isLoggedIn = true
    }
  }

  setSession(signInResponse : SignInResponse){
    localStorage.setItem("token", signInResponse.token);
    this.isLoggedIn = true
    // let decoded_token = this.helper.decodeToken(authResponse.access)
  }

  getToken(): String | null {
    return localStorage.getItem("token");
  }

  logout() : void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }

  async signIn(code: String): Promise<void> {
    if (localStorage.getItem("token") !== null){
      return
    }
    const url: string = this.baseURL + `sign-in?code=${code}`;
    this.http.get<SignInResponse>(url)
      .subscribe({
        next: res => {
          this.setSession(res);
        },
        error: err => console.error(err)
      })
  }
}
