import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AccountService } from '@app/_services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);
    
    return next(req).pipe(
        catchError(err => {
            console.error('ErrorInterceptor: HTTP Error:', {
                status: err.status,
                message: err.error?.message || err.statusText,
                url: req.url
            });

            if ([401, 403].includes(err.status) && accountService.accountValue) {
                console.log('ErrorInterceptor: Authentication error, logging out');
                accountService.logout();
            }

            const error = err.error?.message || err.statusText;
            return throwError(() => error);
        })
    );
};
