import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Role } from '../_models/role';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const user = authService.userValue;
    
    if (user && user.role === Role.Admin) {
        return true;
    }

    router.navigate(['/']);
    return false;
};