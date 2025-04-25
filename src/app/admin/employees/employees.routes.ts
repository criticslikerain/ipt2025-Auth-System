import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeDetailsComponent } from './employee-details.component';

export const EMPLOYEES_ROUTES: Routes = [
    {
        path: '',
        children: [ 
            {
                path: '',
                component: EmployeeListComponent
            },
            {
                path: 'new',
                component: EmployeeDetailsComponent
            },
            {
                path: ':id',
                component: EmployeeDetailsComponent
            },
            {
                path: ':id/edit',
                component: EmployeeDetailsComponent
            }
        ]
    }
];