import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
}

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="users-container">
            <div class="users-header">
                <h2>User Management</h2>
                <div class="search-box">
                    <input 
                        type="text" 
                        [(ngModel)]="searchTerm" 
                        placeholder="Search users..."
                        (input)="filterUsers()"
                    >
                </div>
            </div>

            <table class="users-table">
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
                    <tr *ngFor="let user of filteredUsers">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.role }}</td>
                        <td>
                            <span class="status-badge" [class.active]="user.status === 'active'">
                                {{ user.status }}
                            </span>
                        </td>
                        <td>
                            <button class="btn-edit" (click)="editUser(user)">Edit</button>
                            <button class="btn-delete" (click)="deleteUser(user)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    styles: [`
        .users-container {
            padding: 1rem;
        }

        .users-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .search-box input {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 300px;
        }

        .users-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .users-table th,
        .users-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        .users-table th {
            background-color: #f8f9fa;
            font-weight: 600;
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

        .btn-edit,
        .btn-delete {
            padding: 0.25rem 0.75rem;
            border: none;
            border-radius: 4px;
            margin-right: 0.5rem;
            cursor: pointer;
        }

        .btn-edit {
            background-color: #007bff;
            color: white;
        }

        .btn-delete {
            background-color: #dc3545;
            color: white;
        }
    `]
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    searchTerm = '';

    ngOnInit() {
        // In a real app, fetch users from a service
        this.users = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'active' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
        ];
        this.filteredUsers = [...this.users];
    }

    filterUsers() {
        this.filteredUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    editUser(user: User) {
        // Implement edit functionality
        console.log('Edit user:', user);
    }

    deleteUser(user: User) {
        // Implement delete functionality
        console.log('Delete user:', user);
    }
}