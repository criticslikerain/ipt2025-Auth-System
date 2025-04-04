import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Account, RegisterRequest } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account | null>(this.getUserFromStorage());
        this.account = this.accountSubject.asObservable();
    }

    private getUserFromStorage(): Account | null {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user && user.jwtToken) {
                    return user;
                }
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
            // Clear invalid storage
            localStorage.removeItem('user');
        }
        return null;
    }

    public get accountValue() {
        return this.accountSubject.value;
    }

    getById(id: string | number) {
        const numericId = typeof id === 'string' ? parseInt(id) : id;
        console.log('AccountService: Getting user by ID:', numericId);
        console.log('AccountService: Current auth token:', this.accountValue?.jwtToken);
        
        return this.http.get<Account>(`${environment.apiUrl}/api/account/${numericId}`)
            .pipe(
                tap(response => console.log('AccountService: User data received:', response)),
                catchError(error => {
                    console.error('AccountService: Error fetching user:', error);
                    if (error.status === 401) {
                        console.log('AccountService: Unauthorized, logging out');
                        this.logout();
                    }
                    return throwError(() => error);
                })
            );
    }

    update(id: string, params: any) {
        return this.http.put<Account>(`${environment.apiUrl}/api/accounts/${id}`, params)
            .pipe(map(account => {
                if (account.id === this.accountValue?.id) {
                    account = { ...this.accountValue, ...account };
                    localStorage.setItem('user', JSON.stringify(account));
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/accounts/${id}`)
            .pipe(map(() => {
                if (id === this.accountValue?.id) {
                    this.logout();
                }
            }));
    }

    login(email: string, password: string) {
        return this.http.post<Account>(`${environment.apiUrl}/api/account/login`, { email, password })
            .pipe(
                tap(account => {
                    console.log('AccountService: Login response:', account);
                    if (!account.jwtToken) {
                        console.error('AccountService: No JWT token in login response');
                        throw new Error('Login failed: No authentication token received');
                    }
                    console.log('AccountService: Storing account data');
                    localStorage.setItem('user', JSON.stringify(account));
                    this.accountSubject.next(account);
                }),
                catchError(error => {
                    console.error('AccountService: Login failed:', error);
                    return throwError(() => error);
                })
            );
    }

    logout() {
        console.log('AccountService: Logging out...');
        // Remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: RegisterRequest) {
        return this.http.post(`${environment.apiUrl}/api/account/register`, user)
            .pipe(
                catchError(error => {
                    console.error('Registration request failed:', error);
                    return throwError(() => error);
                })
            );
    }

    verifyEmail(token: string) {
        console.log('AccountService: Attempting to verify email with token:', token);
        return this.http.post(`${environment.apiUrl}/api/account/verify-email`, { token })
            .pipe(
                tap(() => console.log('AccountService: Email verification request successful')),
                catchError(error => {
                    console.error('AccountService: Email verification failed:', error);
                    return throwError(() => error.error?.message || 'Verification failed');
                })
            );
    }

    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}/api/account/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${environment.apiUrl}/api/account/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string) {
        return this.http.post(`${environment.apiUrl}/api/account/reset-password`, {
            token,
            password
        });
    }

    refreshToken() {
        return this.http.post<Account>(`${environment.apiUrl}/api/account/refresh-token`, {})
            .pipe(map((user) => {
                this.accountSubject.next(user);
                return user;
            }));
    }

    getProfile() {
        return this.http.get<Account>(`${environment.apiUrl}/api/account/profile`);
    }

    updateProfile(params: any) {
        return this.http.put<Account>(`${environment.apiUrl}/api/account/profile`, params)
            .pipe(map(user => {
                if (user.id === this.accountValue?.id) {
                    user = { ...this.accountValue, ...user };
                    localStorage.setItem('user', JSON.stringify(user));
                    this.accountSubject.next(user);
                }
                return user;
            }));
    }

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
