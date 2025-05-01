import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/_services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [RouterModule, CommonModule],
    template: `
        <nav class="navbar" *ngIf="!isVerifyEmailRoute">
            <div class="nav-brand">
                <a routerLink="/">Auth System</a>
            </div>
            <div class="nav-items">
                <ng-container *ngIf="!authService.userValue">
                    <a routerLink="/account/login" routerLinkActive="active">Login</a>
                    <a routerLink="/account/register" routerLinkActive="active">Register</a>
                </ng-container>
                <ng-container *ngIf="authService.userValue">
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
export class NavComponent implements OnInit {
    isAdmin = false;
    isVerifyEmailRoute = false;

    constructor(
        private router: Router,
        public authService: AuthService
    ) {
        // Check if current route is verify-email
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.isVerifyEmailRoute = event.url.includes('/account/verify-email');
        });
    }

    ngOnInit() {
        // Check if the user is an admin
        this.authService.user.subscribe(user => {
            this.isAdmin = user?.role === 'Admin';
        });
        
        // Check initial route
        this.isVerifyEmailRoute = this.router.url.includes('/account/verify-email');
    }

    logout() {
        this.authService.logout();
    }
}

