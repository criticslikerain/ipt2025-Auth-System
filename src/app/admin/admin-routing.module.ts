import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { UserManagementComponent } from './user-management.component';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from '@app/_helpers/auth.guard';
import { AdminGuard } from '@app/_helpers/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard, AdminGuard],
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

