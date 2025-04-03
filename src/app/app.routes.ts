import { Routes } from '@angular/router';
import { authGuard } from './_helpers/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.routes').then(m => m.ACCOUNT_ROUTES)
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.routes').then(m => m.PROFILE_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [authGuard]
    },
    // Catch all redirect to home
    { path: '**', redirectTo: '' }
];








