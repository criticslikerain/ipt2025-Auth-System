import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '@app/_services/auth.service';
import { AlertService } from '@app/_services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const alertService = inject(AlertService);
    
    return next(req).pipe(
        catchError(err => {
            if ([401, 403].includes(err.status) && authService.userValue) {
                // auto logout if 401 or 403 response returned from api
                authService.logout();
                alertService.error('Session expired. Please login again.');
            }

            // Handle network errors
            if (err.status === 0) {
                alertService.error('Unable to connect to the server. Please check your internet connection or try again later.');
                return throwError(() => 'Network error occurred');
            }

            // Handle validation errors
            if (err.status === 400 && err.error?.errors) {
                const validationErrors = Object.values(err.error.errors).join('<br>');
                alertService.error(validationErrors);
            }

            // Handle other errors
            const error = err.error?.message || err.error || err.statusText || 'Unknown Error';
            alertService.error(error);
            
            return throwError(() => error);
        })
    );
};
