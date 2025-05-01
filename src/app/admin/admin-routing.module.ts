import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { StatusManagementComponent } from './status/status-management.component';
import { StatusDetailsComponent } from './status/status-details.component';
import { SettingsComponent } from './settings.component';
import { authGuard } from '../_helpers/auth.guard';

const routes: Routes = [
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
                    .then(m => m.AccountRoutingModule),
                title: 'Account Management'
            },
            {
                path: 'status',
                children: [
                    {
                        path: '',
                        component: StatusManagementComponent,
                        title: 'Status Management'
                    },
                    {
                        path: ':id',
                        component: StatusDetailsComponent,
                        title: 'Status Details'
                    }
                ]
            },
            {
                path: 'settings',
                component: SettingsComponent,
                title: 'Admin Settings'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
    constructor() {
        console.log('Admin Routing Module loaded');
    }
}
