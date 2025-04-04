import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
import { environment } from '@environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);
    const account = accountService.accountValue;
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    
    if (account?.jwtToken && isApiUrl) {
        console.log('Adding auth header for:', req.url);
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${account.jwtToken}`
            }
        });
    }

    return next(req);
}
