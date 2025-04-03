import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { UserManagementComponent } from './user-management.component';
import { SettingsComponent } from './settings.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UserManagementComponent },
            { path: 'settings', component: SettingsComponent }
        ]
    }
];

