import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '@app/_services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '@app/_services/employee.service';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];
    filteredEmployees: Employee[] = [];
    searchTerm = '';
    loading = false;

    constructor(
        private router: Router,
        private employeeService: EmployeeService
    ) {}

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.loading = true;
        this.employeeService.getAll()
            .subscribe({
                next: (employees) => {
                    this.employees = employees;
                    this.filteredEmployees = [...employees];
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading employees:', error);
                    this.loading = false;
                }
            });
    }

    filterEmployees() {
        const searchTermLower = this.searchTerm.toLowerCase();
        this.filteredEmployees = this.employees.filter(employee => 
            employee.name.toLowerCase().includes(searchTermLower) ||
            employee.email.toLowerCase().includes(searchTermLower) ||
            employee.role.toLowerCase().includes(searchTermLower)
        );
    }

    viewDetails(employee: Employee) {
        this.router.navigate(['/admin/employees', employee.id]);
    }

    editEmployee(employee: Employee) {
        this.router.navigate(['/admin/employees', employee.id, 'edit']);
    }
}



