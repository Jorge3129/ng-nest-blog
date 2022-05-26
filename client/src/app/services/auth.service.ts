import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

export interface LoginForm {
  email: string;
  password: string;
}

export const JWT_NAME = 'blog-token';
const API = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(loginForm: LoginForm) {

    return this.http.post<any>(API + '/user/login', {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        console.log('token' + token.access_token);
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    )
  }

  logout() {
    localStorage.removeItem(JWT_NAME);
  }

  // register(user: User) {
  //   return this.http.post<any>('/api/users', user);
  // }

}
