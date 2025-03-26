import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = request;

    return of(null).pipe(
      mergeMap(handleRoute),
      materialize(),
      delay(500),
      dematerialize()
    );

    function handleRoute(): Observable<HttpEvent<any>> {
      switch (true) {
        case url.endsWith('/accounts/authenticate') && method === 'POST':
          return authenticate(body);
        case url.endsWith('/accounts/register') && method === 'POST':
          return register(body);
        case url.endsWith('/accounts/forgot-password') && method === 'POST':
          return ok({ message: 'Password reset link sent to email.' });
        case url.endsWith('/accounts/reset-password') && method === 'POST':
          return ok({ message: 'Password has been reset successfully.' });
        case url.endsWith('/accounts/verify-email') && method === 'POST':
          return ok({ message: 'Email verified successfully.' });
        default:
          return next.handle(request);
      }
    }

    // route functions
    function authenticate(body: any): Observable<HttpEvent<any>> {
      const { email, password } = body;
      if (email === 'test@example.com' && password === 'test123') {
        return ok({
          id: 1,
          email,
          firstName: 'Test',
          lastName: 'User',
          jwtToken: 'fake-jwt-token'
        });
      } else {
        return error('Email or password is incorrect');
      }
    }

    function register(body: any): Observable<HttpEvent<any>> {
      const account = { ...body, id: Math.floor(Math.random() * 1000) };
      return ok(account);
    }

    // helper functions
    function ok(body?: any): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: string): Observable<never> {
      return throwError(() => new HttpErrorResponse({ status: 400, error: { message } }));
    }
  }
}
