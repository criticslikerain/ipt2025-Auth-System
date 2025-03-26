import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '@app/_services';  // Ensure correct import path

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // Handle 401 or 403 errors
        if ([401, 403].includes(err.status) && this.accountService.accountValue) {
          // Auto logout if 401 or 403 response returned from API
          this.accountService.logout();
        }

        // Extract error message
        const error = (err && err.error && err.error.message) || err.statusText;

        // Log the error
        console.error(err);

        // Return the error
        return throwError(error);
      })
    );
  }
}
