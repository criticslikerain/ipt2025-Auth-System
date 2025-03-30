import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AccountService } from '@app/_services';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const accountService = inject(AccountService);

    if (accountService.accountValue) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
