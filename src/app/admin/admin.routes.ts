import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from './settings.component';
import { authGuard } from '../_helpers/auth.guard';
import { adminGuard } from '../_helpers/admin.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard, adminGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'accounts',
                loadChildren: () => import('./accounts/account-routing.module')
                    .then(m => m.AccountRoutingModule)
            },
            {
                path: 'employees',
                loadChildren: () => import('./employees/employees.routes')
                    .then(m => m.EMPLOYEES_ROUTES)
            },
            {
                path: 'settings',
                component: SettingsComponent
            }
        ]
    }
];

