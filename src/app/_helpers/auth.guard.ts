import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AccountService } from '@app/_services';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const accountService = inject(AccountService);
    
    const account = accountService.accountValue;
    console.log('AuthGuard: Checking authentication...', {
        account: account,
        hasJwtToken: !!account?.jwtToken,
        targetUrl: state.url
    });

    if (account?.jwtToken) {
        console.log('AuthGuard: User is authenticated, allowing access');
        return true;
    }

    console.log('AuthGuard: User is not authenticated, redirecting to login');
    router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    return false;
};
