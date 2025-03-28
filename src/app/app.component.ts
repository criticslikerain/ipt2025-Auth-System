import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from './_components/nav.component';
import { AlertComponent } from './_components/alert.component';
import { LoadingComponent } from './_components/loading.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NavComponent,
        AlertComponent,
        LoadingComponent
    ]
})
export class AppComponent {
    title = 'Auth System';
}
