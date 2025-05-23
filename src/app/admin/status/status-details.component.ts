import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-status-details',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="details-container">
            <div class="header">
                <h2>Employee Status Details</h2>
                <button class="btn-back" (click)="goBack()">Back to List</button>
            </div>
            
            <div class="details-card" *ngIf="employee">
                <div class="detail-row">
                    <span class="label">Name:</span>
                    <span class="value">{{employee.name}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">{{employee.email}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Role:</span>
                    <span class="value">{{employee.role}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span class="status-badge" [class.active]="employee.status === 'active'">
                        {{employee.status}}
                    </span>
                </div>
                
                <div class="actions">
                    <button 
                        class="btn-toggle" 
                        [class.active]="employee.status === 'active'"
                        (click)="toggleStatus()"
                    >
                        Toggle Status
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .details-container {
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .btn-back {
            padding: 0.5rem 1rem;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .details-card {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .detail-row {
            display: flex;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        .label {
            font-weight: bold;
            width: 120px;
        }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            background-color: #dc3545;
            color: white;
        }
        .status-badge.active {
            background-color: #28a745;
        }
        .btn-toggle {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background-color: #dc3545;
            color: white;
        }
        .btn-toggle.active {
            background-color: #28a745;
        }
    `]
})
export class StatusDetailsComponent implements OnInit {
    employee: any;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        // In a real app, fetch employee details using ID from route params
        this.employee = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'User',
            status: 'active'
        };
    }

    goBack() {
        window.history.back();
    }

    toggleStatus() {
        this.employee.status = this.employee.status === 'active' ? 'inactive' : 'active';
        // In a real app, update status in backend
        console.log('Updated status:', this.employee);
    }
}