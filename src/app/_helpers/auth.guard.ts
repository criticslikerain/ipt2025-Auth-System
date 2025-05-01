import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const user = authService.userValue;
    if (user) {
        return true;
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    return false;
};
