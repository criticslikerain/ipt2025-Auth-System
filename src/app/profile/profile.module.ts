import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsComponent } from './details.component';
import { RouterModule } from '@angular/router';
import { profileRoutes } from './profile-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(profileRoutes)
    ],
    declarations: [
        DetailsComponent
    ]
})
export class ProfileModule { } 
