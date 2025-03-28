import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav class="navbar">
            <div class="nav-brand">
                <a routerLink="/">Auth System</a>
            </div>
            <div class="nav-items">
                <ng-container *ngIf="!isLoggedIn">
                    <a routerLink="/account/login" routerLinkActive="active">Login</a>
                    <a routerLink="/account/register" routerLinkActive="active">Register</a>
                </ng-container>
                <ng-container *ngIf="isLoggedIn">
                    <a routerLink="/profile" routerLinkActive="active">Profile</a>
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
            background-color: #333;
            color: white;
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
            background-color: #555;
        }

        .active {
            background-color: #555;
        }
    `]
})
export class NavComponent implements OnInit {
    isLoggedIn = false;

    constructor(private router: Router) {}

    ngOnInit() {
        // Check if user is logged in (you might want to use a service for this)
        this.isLoggedIn = !!localStorage.getItem('user');
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigate(['/account/login']);
    }
}

