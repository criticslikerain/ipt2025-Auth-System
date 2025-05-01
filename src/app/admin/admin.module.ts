import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Routing
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { StatusManagementComponent } from './status/status-management.component';
import { StatusDetailsComponent } from './status/status-details.component';
import { SettingsComponent } from './settings.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        // Standalone Components
        StatusManagementComponent,
        StatusDetailsComponent
    ],
    declarations: [
        LayoutComponent,
        DashboardComponent,
        SettingsComponent
    ],
    providers: []
})
export class AdminModule {
    constructor() {
        console.log('Admin Module loaded');
    }
}
