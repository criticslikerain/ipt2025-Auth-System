import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { UserManagementComponent } from './user-management.component';
import { SettingsComponent } from './settings.component';
import { authGuard } from '../_helpers/auth.guard';
import { adminGuard } from '../_helpers/admin.guard';

const routes: Routes = [
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
                component: DashboardComponent,
                data: { title: 'Admin Dashboard' }
            },
            {
                path: 'users',
                component: UserManagementComponent,
                data: { title: 'User Management' }
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: { title: 'Admin Settings' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule {}