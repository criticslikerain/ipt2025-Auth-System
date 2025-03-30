import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '@app/_services';
import { LogoutDialogComponent } from '@app/_components/logout-dialog.component';

@Component({
    selector: 'app-profile-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        LogoutDialogComponent
    ]
})
export class LayoutComponent {
    constructor(public accountService: AccountService) {}
}

