import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AccountService } from '@app/_services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);
    
    return next(req).pipe(
        catchError(err => {
            // Detailed error logging
            const errorDetails = {
                status: err.status,
                statusText: err.statusText,
                message: err.error?.message || err.statusText,
                url: req.url,
                method: req.method,
                timestamp: new Date().toISOString()
            };
            
            console.error('HTTP Error:', errorDetails);

            // Handle authentication errors
            if ([401, 403].includes(err.status)) {
                if (accountService.accountValue) {
                    console.log('Authentication error detected, logging out user');
                    accountService.logout();
                }
                return throwError(() => 'Unauthorized access');
            }

            // Handle network errors
            if (err.status === 0) {
                return throwError(() => 'Network error. Please check your connection');
            }

            // Handle server errors
            if (err.status >= 500) {
                return throwError(() => 'Server error. Please try again later');
            }

            // Handle validation errors
            if (err.status === 400) {
                const validationError = err.error?.message || 'Validation error';
                return throwError(() => validationError);
            }

            // Handle not found errors
            if (err.status === 404) {
                return throwError(() => 'Resource not found');
            }

            // Return original error message or a generic one
            const errorMessage = err.error?.message || err.statusText || 'An error occurred';
            return throwError(() => errorMessage);
        })
    );
};
