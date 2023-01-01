import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { AuthResult } from '../models/auth-result';
import { User } from '../models/user';
import { UserDTO } from '../models/userDTO';
import { UserService } from './user.service';
import { TokenPayload } from '../models/token';
import { Router } from '@angular/router';

export enum TOKEN_VALUES {
  TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'Auth';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInSource: Observable<boolean> = this.isLoggedIn.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    const token = this.getToken();
    !!token && console.log(this.decodeToken(token));
    if (token) {
      // CHECKING IF TOKEN HAS EXPIRED
      const tokenPayload = this.decodeToken(token);
      const dateNow = (new Date().getTime() + 1) / 1000;
      const expiry = tokenPayload.exp;

      // EXPIRED TOKEN
      if (dateNow > expiry) {
        this.refreshToken().subscribe((authResult) => {
          // REFRESH TOKEN EXPIRED TOO -> LOGOUT
          if (!authResult.token || !authResult.refreshToken) this.logout();
          // ACCESS TOKEN EXPIRED - REFRESH TOKEN STILL VALID
          else {
            this.setToken(authResult.token);
            this.setRefreshToken(authResult.refreshToken);
            const tokenPayload = this.decodeToken(authResult.token);
            this.userService.user.next({
              email: tokenPayload.email,
              username: tokenPayload.name,
              role: tokenPayload.role,
            });
            this.isLoggedIn.next(true);
          }
        });
      }

      // TOKEN NOT EXPIRED
      this.userService.user.next({
        email: tokenPayload.email,
        username: tokenPayload.name,
        role: tokenPayload.role,
      });
      this.isLoggedIn.next(true);
    } else {
      // TOKEN NOT EXISTING
      this.isLoggedIn.next(false);
      this.userService.user.next(new User());
    }
  }

  login(user: UserDTO): Observable<AuthResult> {
    return this.http.post<AuthResult>(
      `${environment.apiUrl}/${this.url}/Login`,
      user
    );
  }

  register(user: UserDTO): Observable<AuthResult> {
    return this.http.post<AuthResult>(
      `${environment.apiUrl}/${this.url}/Register`,
      user
    );
  }

  logout(): void {
    this.userService.user.next(new User());
    this.isLoggedIn.next(false);
    this.removeToken();
    this.removeRefreshToken();
    this.router.navigate(['/']);
  }

  getToken(): string {
    const token = window.localStorage.getItem(TOKEN_VALUES.TOKEN);
    return token || '';
  }

  setToken(token: string): void {
    window.localStorage.setItem(TOKEN_VALUES.TOKEN, token);
  }

  removeToken(): void {
    window.localStorage.removeItem(TOKEN_VALUES.TOKEN);
  }

  getRefreshToken(): string {
    const refreshToken = window.localStorage.getItem(
      TOKEN_VALUES.REFRESH_TOKEN
    );
    return refreshToken || '';
  }

  setRefreshToken(refreshToken: string): void {
    window.localStorage.setItem(TOKEN_VALUES.REFRESH_TOKEN, refreshToken);
  }

  removeRefreshToken(): void {
    window.localStorage.removeItem(TOKEN_VALUES.REFRESH_TOKEN);
  }

  refreshToken(): Observable<AuthResult> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResult>(
      `${environment.apiUrl}/${this.url}/RefreshToken`,
      { token, refreshToken }
    );
  }

  decodeToken(token: string): TokenPayload {
    const decoded = jwt_decode<TokenPayload>(token);
    return decoded;
  }
}
