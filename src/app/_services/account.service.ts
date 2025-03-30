import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Account, RegisterRequest, ResetPasswordRequest } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;
    private logoutSubject = new BehaviorSubject<boolean>(false);
    public logoutState = this.logoutSubject.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account | null>(
            JSON.parse(localStorage.getItem('user')!)
        );
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue() {
        return this.accountSubject.value;
    }

    // Add this method to your AccountService class
    getById(id: string) {
        return this.http.get<Account>(`${environment.apiUrl}/api/account/${id}`)
            .pipe(
                catchError(error => {
                    console.error('Error fetching account:', error);
                    return throwError(() => error);
                })
            );
    }

    // Update account
    update(id: string, params: any) {
        return this.http.put<Account>(`${environment.apiUrl}/api/accounts/${id}`, params)
            .pipe(map(account => {
                // update stored account if the logged in account updated their own record
                if (account.id === this.accountValue?.id) {
                    account = { ...this.accountValue, ...account };
                    localStorage.setItem('user', JSON.stringify(account));
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    // Delete account
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/accounts/${id}`)
            .pipe(map(() => {
                // auto logout if the logged in account deleted their own record
                if (id === this.accountValue?.id) {
                    this.logout();
                }
            }));
    }

    // Login
    login(email: string, password: string) {
        return this.http.post<Account>(`${environment.apiUrl}/api/account/login`, { email, password })
            .pipe(map(user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.accountSubject.next(user);
                return user;
            }));
    }

    // Logout
    logout() {
        // Signal logout state change
        this.logoutSubject.next(true);
        
        // Remove user from local storage after delay
        setTimeout(() => {
            localStorage.removeItem('user');
            this.accountSubject.next(null);
            this.logoutSubject.next(false);
            this.router.navigate(['/account/login']);
        }, 3000);
    }

    // Register
    register(user: RegisterRequest) {
        console.log('Attempting registration to:', `${environment.apiUrl}/api/account/register`);
        return this.http.post(`${environment.apiUrl}/api/account/register`, user)
            .pipe(
                catchError(error => {
                    console.error('Registration request failed:', error);
                    return throwError(() => error);
                })
            );
    }

    // Verify Email
    verifyEmail(token: string) {
        return this.http.post(`${environment.apiUrl}/api/account/verify-email`, { token });
    }

    // Forgot Password
    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}/api/account/forgot-password`, { email });
    }

    // Validate Reset Token
    validateResetToken(token: string) {
        return this.http.post(`${environment.apiUrl}/api/account/validate-reset-token`, { token });
    }

    // Reset Password
    resetPassword(token: string, password: string) {
        return this.http.post(`${environment.apiUrl}/api/account/reset-password`, {
            token,
            password
        });
    }

    // Refresh Token
    refreshToken() {
        return this.http.post<Account>(`${environment.apiUrl}/api/account/refresh-token`, {})
            .pipe(map((user) => {
                this.accountSubject.next(user);
                return user;
            }));
    }

    // Get User Profile
    getProfile() {
        return this.http.get<Account>(`${environment.apiUrl}/api/account/profile`);
    }

    // Update User Profile
    updateProfile(params: any) {
        return this.http.put<Account>(`${environment.apiUrl}/api/account/profile`, params)
            .pipe(map(user => {
                // update stored user if the logged in user updated their own record
                if (user.id === this.accountValue?.id) {
                    user = { ...this.accountValue, ...user };
                    localStorage.setItem('user', JSON.stringify(user));
                    this.accountSubject.next(user);
                }
                return user;
            }));
    }

    // Change Password
    changePassword(oldPassword: string, newPassword: string) {
        return this.http.post(`${environment.apiUrl}/api/account/change-password`, {
            oldPassword,
            newPassword
        });
    }

    resendVerificationEmail(email: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/account/resend-verification-email`, { email })
            .pipe(map(() => true));
    }
}
