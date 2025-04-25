import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeDetailsComponent } from './employee-details.component';

const routes: Routes = [
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

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }