import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="admin-container">
            <nav class="admin-sidebar">
                <div class="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <ul class="sidebar-nav">
                    <li>
                        <a routerLink="./dashboard" routerLinkActive="active">
                            <i class="fas fa-tachometer-alt"></i> Dashboard
                        </a>
                    </li>
                    <li>
                        <a routerLink="./users" routerLinkActive="active">
                            <i class="fas fa-users"></i> Users
                        </a>
                    </li>
                    <li>
                        <a routerLink="./settings" routerLinkActive="active">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                    </li>
                </ul>
            </nav>
            <main class="admin-content">
                <router-outlet></router-outlet>
            </main>
        </div>
    `,
    styles: [`
        .admin-container {
            display: flex;
            min-height: 100vh;
        }

        .admin-sidebar {
            width: 250px;
            background-color: #2c3e50;
            color: white;
            padding: 1rem;
        }

        .sidebar-header {
            padding: 1rem;
            border-bottom: 1px solid #34495e;
        }

        .sidebar-nav {
            list-style: none;
            padding: 0;
            margin: 1rem 0;
        }

        .sidebar-nav li a {
            display: block;
            padding: 0.75rem 1rem;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .sidebar-nav li a:hover {
            background-color: #34495e;
        }

        .sidebar-nav li a.active {
            background-color: #3498db;
        }

        .admin-content {
            flex: 1;
            padding: 2rem;
            background-color: #f5f6fa;
        }
    `]
})
export class LayoutComponent { } 
