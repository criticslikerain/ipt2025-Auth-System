import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="dashboard-container">
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <div class="stat-value">{{ stats.totalUsers }}</div>
                </div>
                <div class="stat-card">
                    <h3>Active Users</h3>
                    <div class="stat-value">{{ stats.activeUsers }}</div>
                </div>
                <div class="stat-card">
                    <h3>New Users (Today)</h3>
                    <div class="stat-value">{{ stats.newUsers }}</div>
                </div>
                <div class="stat-card">
                    <h3>System Status</h3>
                    <div class="stat-value" [class.status-good]="stats.systemStatus === 'Good'">
                        {{ stats.systemStatus }}
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .dashboard-container {
            padding: 1rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3 {
            margin: 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            margin-top: 0.5rem;
            color: white;
        }

        .status-good {
            color: #2ecc71;
        }
    `]
})
export class DashboardComponent implements OnInit {
    stats = {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        systemStatus: 'Good'
    };

    ngOnInit() {
        // In a real app, you would fetch these stats from a service
        this.stats = {
            totalUsers: 1250,
            activeUsers: 847,
            newUsers: 23,
            systemStatus: 'Good'
        };
    }
}
