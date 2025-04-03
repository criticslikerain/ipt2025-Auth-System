import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AccountService } from '@app/_services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);
    
    return next(req).pipe(
        catchError(err => {
            if ([401, 403].includes(err.status) && accountService.accountValue) {
                accountService.logout();
            }
            const error = err.error?.message || err.statusText;
            return throwError(() => error);
        })
    );
}
