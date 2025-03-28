import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/accounts/authenticate`, { email, password })
            .pipe(map(user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/accounts/register`, user);
    }

    verifyEmail(token: string) {
        return this.http.post(`${environment.apiUrl}/accounts/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}/accounts/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${environment.apiUrl}/accounts/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${environment.apiUrl}/accounts/reset-password`, {
            token,
            password,
            confirmPassword
        });
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/accounts`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/accounts/${id}`);
    }

    create(params: any) {
        return this.http.post(`${environment.apiUrl}/accounts`, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/accounts/${id}`, params)
            .pipe(map(user => {
                // update stored user if the logged in user updated their own record
                if (id === this.userValue?.id) {
                    const updatedUser = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.userSubject.next(updatedUser);
                }
                return user;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/accounts/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in user deleted their own record
                if (id === this.userValue?.id) {
                    this.logout();
                }
            }));
    }
}
