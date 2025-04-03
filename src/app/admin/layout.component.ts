import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.less'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class LayoutComponent {
    constructor(private router: Router) {}
}
