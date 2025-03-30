import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const ACCOUNT_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            {
                path: 'login',
                loadComponent: () => import('./login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'verify-email',
                loadComponent: () => import('./verify-email.component').then(m => m.VerifyEmailComponent)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./forgot-password.component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'reset-password',
                loadComponent: () => import('./reset-password.component').then(m => m.ResetPasswordComponent)
            }
        ]
    }
];






