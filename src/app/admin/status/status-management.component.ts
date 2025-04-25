import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface EmployeeStatus {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
}

@Component({
    selector: 'app-status-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="status-container">
            <div class="header">
                <h2>Employee Status Management</h2>
                <div class="search-box">
                    <input 
                        type="text" 
                        [(ngModel)]="searchTerm" 
                        placeholder="Search employees..."
                        (input)="filterEmployees()"
                    >
                </div>
            </div>

            <table class="status-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let employee of filteredEmployees" (click)="viewDetails(employee)">
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.email }}</td>
                        <td>{{ employee.role }}</td>
                        <td>
                            <span class="status-badge" [class.active]="employee.status === 'active'">
                                {{ employee.status }}
                            </span>
                        </td>
                        <td>
                            <button 
                                class="btn-toggle" 
                                [class.active]="employee.status === 'active'"
                                (click)="toggleStatus(employee)"
                            >
                                Toggle Status
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    styles: [`
        .status-container {
            padding: 2rem;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .status-table {
            width: 100%;
            border-collapse: collapse;
        }
        .status-table th, .status-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
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
export class StatusManagementComponent implements OnInit {
    employees: EmployeeStatus[] = [];
    filteredEmployees: EmployeeStatus[] = [];
    searchTerm = '';

    constructor(private router: Router) {}

    ngOnInit() {
        // In a real app, fetch from service
        this.employees = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'inactive' },
        ];
        this.filteredEmployees = [...this.employees];
    }

    filterEmployees() {
        this.filteredEmployees = this.employees.filter(employee => 
            employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    toggleStatus(employee: EmployeeStatus) {
        employee.status = employee.status === 'active' ? 'inactive' : 'active';
        // In a real app, update status in backend
        console.log('Toggle status:', employee);
    }

    viewDetails(employee: EmployeeStatus) {
        this.router.navigate(['/admin/status', employee.id]);
    }
}
