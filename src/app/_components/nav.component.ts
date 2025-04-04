import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    template: `
        <nav class="navbar">
            <div class="nav-brand">
                <a routerLink="/">Auth System</a>
            </div>
            <div class="nav-items">
                <ng-container *ngIf="!accountService.accountValue">
                    <a routerLink="/account/login" routerLinkActive="active">Login</a>
                    <a routerLink="/account/register" routerLinkActive="active">Register</a>
                </ng-container>
                <ng-container *ngIf="accountService.accountValue">
                    <a routerLink="/profile" routerLinkActive="active">Profile</a>
                    <a routerLink="/admin" routerLinkActive="active" *ngIf="isAdmin">Admin</a>
                    <a href="javascript:void(0)" (click)="logout()">Logout</a>
                </ng-container>
            </div>
        </nav>
    `,
    styles: [`
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            color: white;
            background: transparent;
        }

        .nav-brand a {
            color: white;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .nav-items a {
            color: white;
            text-decoration: none;
            margin-left: 1.5rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .nav-items a:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .active {
            background-color: rgba(255, 255, 255, 0.1);
        }
    `]
})
export class NavComponent {
    constructor(public accountService: AccountService) {}

    logout() {
        this.accountService.logout();
    }

    get isAdmin() {
        return this.accountService.accountValue?.role === 'Admin';
    }
}

