import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from '../_helpers/auth.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                title: 'Admin Dashboard'
            },
            {
                path: 'accounts',
                loadChildren: () => import('./accounts/account-routing.module')
                    .then(m => m.AccountRoutingModule)
            }
        ]
    }
];

