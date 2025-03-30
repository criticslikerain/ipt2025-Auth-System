import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
import { environment } from '@environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);
    const user = accountService.accountValue;
    const isLoggedIn = user?.jwtToken;
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    
    if (isLoggedIn && isApiUrl) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${user.jwtToken}`
            }
        });
    }

    return next(req);
}
