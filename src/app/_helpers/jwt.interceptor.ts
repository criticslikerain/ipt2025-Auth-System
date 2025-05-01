import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { environment } from '@environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const user = authService.userValue;
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    
    if (user?.token && isApiUrl) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${user.token}`
            }
        });
    }

    return next(req);
}
