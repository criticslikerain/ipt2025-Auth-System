import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Employee {
    id?: string;
    name: string;
    email: string;
    role: string;
    status?: 'active' | 'inactive';
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private http: HttpClient) { }

    createFromAccount(accountData: any): Observable<Employee> {
        const employeeData: Omit<Employee, 'id'> = {
            name: `${accountData.firstName} ${accountData.lastName}`,
            email: accountData.email,
            role: accountData.role,
            status: 'active'
        };
        return this.create(employeeData);
    }

    updateFromAccount(id: string, accountData: any): Observable<Employee> {
        const employeeData: Partial<Employee> = {
            name: `${accountData.firstName} ${accountData.lastName}`,
            email: accountData.email,
            role: accountData.role
        };
        return this.update(id, employeeData);
    }

    getAll(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${environment.apiUrl}/api/employees`);
    }

    getById(id: string): Observable<Employee> {
        return this.http.get<Employee>(`${environment.apiUrl}/api/employees/${id}`);
    }

    create(employee: Omit<Employee, 'id'>): Observable<Employee> {
        return this.http.post<Employee>(`${environment.apiUrl}/api/employees`, employee);
    }

    update(id: string, employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<Employee>(`${environment.apiUrl}/api/employees/${id}`, employee);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/employees/${id}`);
    }
}



