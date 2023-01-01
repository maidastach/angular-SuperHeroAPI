import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthResult } from '../models/auth-result';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (!!token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handleUnathorizedError(request, next);
        }
        return throwError(() => {
          new Error('Internal Server Error');
        });
      })
    );
  }

  handleUnathorizedError(req: HttpRequest<any>, next: HttpHandler) {
    this.authService.isLoggedIn.next(false);
    return this.authService.refreshToken().pipe(
      switchMap((data: AuthResult) => {
        this.authService.setToken(data.token);
        this.authService.setRefreshToken(data.refreshToken);
        const tokenPayload = this.authService.decodeToken(data.token);
        this.userService.user.next({
          email: tokenPayload.email,
          username: tokenPayload.name,
          role: tokenPayload.role,
        });
        this.authService.isLoggedIn.next(true);
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${data.token}`),
        });
        return next.handle(req);
      }),
      catchError((err: any) => {
        return throwError(() => this.authService.logout());
      })
    );
  }
}
