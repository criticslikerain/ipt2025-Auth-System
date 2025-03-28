import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-subnav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav class="subnav">
            <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/admin/reports" routerLinkActive="active">Reports</a>
            <a routerLink="/admin/settings" routerLinkActive="active">Settings</a>
        </nav>
    `,
    styles: [`
        .subnav {
            background-color: #007bff;
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 15px 0;
            border-radius: 8px;
        }

        .subnav a {
            color: white;
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
            padding: 10px 20px;
            border-radius: 20px;
            transition: background-color 0.3s, transform 0.2s;
        }

        .subnav a.active {
            background-color: #0056b3;
            color: #fff;
        }

        .subnav a:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
        }

        @media (max-width: 600px) {
            .subnav {
                flex-direction: column;
                align-items: center;
            }

            .subnav a {
                width: 80%;
                text-align: center;
            }
        }
    `]
})

export class SubNavComponent { }

