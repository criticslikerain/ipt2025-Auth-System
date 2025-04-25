

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../_models/employee';
import { EmployeeService } from '../_services/employee.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-employee',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="dashboard-container">
            <!-- Add Employee Form -->
            <div class="stat-card" *ngIf="isAddMode || isEditMode">
                <h3>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h3>
                <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            formControlName="name"
                            class="form-control"
                            [ngClass]="{ 'is-invalid': submitted && f['name'].errors }"
                        />
                        <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                            <div *ngIf="f['name'].errors['required']">Name is required</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            formControlName="email"
                            class="form-control"
                            [ngClass]="{ 'is-invalid': submitted && f['email'].errors }"
                        />
                        <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                            <div *ngIf="f['email'].errors['required']">Email is required</div>
                            <div *ngIf="f['email'].errors['email']">Email must be valid</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="role">Role</label>
                        <select
                            id="role"
                            formControlName="role"
                            class="form-control"
                            [ngClass]="{ 'is-invalid': submitted && f['role'].errors }"
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Manager">Manager</option>
                        </select>
                        <div *ngIf="submitted && f['role'].errors" class="invalid-feedback">
                            <div *ngIf="f['role'].errors['required']">Role is required</div>
                        </div>
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="btn-primary">
                            {{ isEditMode ? 'Update' : 'Add' }} Employee
                        </button>
                        <button type="button" class="btn-secondary" (click)="cancelEdit()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <!-- Employee List -->
            <div class="stat-card">
                <div class="list-header">
                    <h3>Employees</h3>
                    <button class="btn-primary" (click)="showAddForm()" *ngIf="!isAddMode && !isEditMode">
                        Add Employee
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="employee-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let employee of employees">
                                <td>{{employee.name}}</td>
                                <td>{{employee.email}}</td>
                                <td>{{employee.role}}</td>
                                <td class="actions">
                                    <button class="btn-primary btn-sm" (click)="editEmployee(employee)">
                                        Edit
                                    </button>
                                    <button class="btn-danger btn-sm" (click)="deleteEmployee(employee.id!)">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            <tr *ngIf="!employees.length">
                                <td colspan="4" class="text-center">No employees found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .dashboard-container {
            padding: 1rem;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 1.5rem;
        }

        .stat-card h3 {
            margin: 0 0 1rem 0;
            color: #666;
            font-size: 1rem;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-control {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .is-invalid {
            border-color: #dc3545;
        }

        .invalid-feedback {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .form-buttons {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .employee-table {
            width: 100%;
            border-collapse: collapse;
        }

        .employee-table th,
        .employee-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-secondary {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-danger {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
        }

        .actions {
            display: flex;
            gap: 0.5rem;
        }

        .text-center {
            text-align: center;
        }
    `]
})
export class EmployeeComponent implements OnInit {
    employees: Employee[] = [];
    employeeForm: FormGroup;
    isAddMode = false;
    isEditMode = false;
    submitted = false;
    editingEmployeeId: string | null = null;

    constructor(
        private employeeService: EmployeeService,
        private formBuilder: FormBuilder
    ) {
        this.employeeForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadEmployees();
    }

    // Convenience getter for easy access to form fields
    get f() { return this.employeeForm.controls; }

    loadEmployees() {
        this.employeeService.getAll()
            .pipe(first())
            .subscribe(employees => {
                this.employees = employees;
            });
    }

    showAddForm() {
        this.isAddMode = true;
        this.isEditMode = false;
        this.employeeForm.reset();
    }

    editEmployee(employee: Employee) {
        this.isEditMode = true;
        this.isAddMode = false;
        this.editingEmployeeId = employee.id!;
        this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            role: employee.role
        });
    }

    cancelEdit() {
        this.isAddMode = false;
        this.isEditMode = false;
        this.editingEmployeeId = null;
        this.employeeForm.reset();
        this.submitted = false;
    }

    onSubmit() {
        this.submitted = true;

        if (this.employeeForm.invalid) {
            return;
        }

        const employeeData = this.employeeForm.value;

        if (this.isEditMode && this.editingEmployeeId) {
            this.employeeService.update(this.editingEmployeeId, employeeData)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.loadEmployees();
                        this.cancelEdit();
                    },
                    error: error => {
                        console.error('Error updating employee:', error);
                    }
                });
        } else {
            this.employeeService.create(employeeData)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.loadEmployees();
                        this.cancelEdit();
                    },
                    error: error => {
                        console.error('Error creating employee:', error);
                    }
                });
        }
    }

    deleteEmployee(id: string) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.loadEmployees();
                    },
                    error: error => {
                        console.error('Error deleting employee:', error);
                    }
                });
        }
    }
}
