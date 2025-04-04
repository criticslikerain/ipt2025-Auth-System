import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
    selector: 'app-profile-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class LayoutComponent {
    constructor(public accountService: AccountService) {}
}

