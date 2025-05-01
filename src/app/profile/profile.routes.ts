import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';

export const PROFILE_ROUTES: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'details', pathMatch: 'full' },
            { path: 'details', component: DetailsComponent },
            { path: 'security', component: UpdateComponent },
            { path: 'preferences', component: DetailsComponent }, // Replace with actual component
            { path: 'notifications', component: DetailsComponent } // Replace with actual component
        ]
    }
];