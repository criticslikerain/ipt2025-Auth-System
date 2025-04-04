import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AccountService } from '../_services';
import { Role } from '../_models/role';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const accountService = inject(AccountService);

    const user = accountService.accountValue;
    
    if (user && user.role === Role.Admin) {
        return true;
    }

    router.navigate(['/']);
    return false;
};
