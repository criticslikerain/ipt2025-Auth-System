import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, finalize, catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Account } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;
    private refreshTokenTimeout?: any;
    private baseUrl = `${environment.apiUrl}/accounts`;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        // Don't clear accounts on service initialization
        // localStorage.removeItem('accounts');
        
        this.accountSubject = new BehaviorSubject<Account | null>(null);
        this.account = this.accountSubject.asObservable();
        
        // Log current accounts for debugging
        console.log('AccountService initialized with accounts:', localStorage.getItem('accounts'));
    }

    public get accountValue() {
        return this.accountSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<Account>(`${this.baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        this.http.post<any>(`${this.baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${this.baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: any) {
        return this.http.post(`${this.baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        console.log('Account service: verifyEmail called with token', token);
        console.log('localStorage before verifyEmail:', localStorage.getItem('accounts'));
        
        return this.http.post(`${this.baseUrl}/verify-email`, { token })
            .pipe(
                tap(response => {
                    console.log('Account service: verifyEmail response', response);
                    console.log('localStorage after verifyEmail:', localStorage.getItem('accounts'));
                }),
                catchError(error => {
                    console.error('Account service: verifyEmail error', error);
                    console.log('localStorage after verifyEmail error:', localStorage.getItem('accounts'));
                    
                    if (error.status === 0) {
                        // If POST fails, try GET
                        return this.http.get(`${this.baseUrl}/verify-email?token=${token}`).pipe(
                            tap(getResponse => {
                                console.log('Account service: verifyEmail GET response', getResponse);
                                console.log('localStorage after verifyEmail GET:', localStorage.getItem('accounts'));
                            }),
                            catchError(getError => {
                                console.error('Account service: verifyEmail GET error', getError);
                                console.log('localStorage after verifyEmail GET error:', localStorage.getItem('accounts'));
                                
                                if (getError.status === 0) {
                                    return throwError(() => 'Unable to connect to server. Please ensure the backend server is running.');
                                }
                                return throwError(() => getError);
                            })
                        );
                    }
                    
                    return throwError(() => error);
                })
            );
    }

    forgotPassword(email: string) {
        return this.http.post(`${this.baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${this.baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string) {
        return this.http.post(`${this.baseUrl}/reset-password`, { token, password });
    }

    create(params: any) {
        return this.http.post(this.baseUrl, params);
    }

    getAll() {
        return this.http.get<Account[]>(this.baseUrl);
    }

    getById(id: string) {
        return this.http.get<Account>(`${this.baseUrl}/${id}`);
    }

    update(id: string | number, params: any) {
        console.log('AccountService.update called with ID:', id, 'Params:', params);
        
        return this.http.put(`${this.baseUrl}/${id}`, params)
            .pipe(
                tap(response => console.log('Update response from server:', response)),
                map((account: any) => {
                    // update stored account if the logged in account updated their own record
                    if (id.toString() === this.accountValue?.id?.toString()) {
                        console.log('Updating stored account. Current:', this.accountValue, 'New data:', account);
                        const updatedAccount = { ...this.accountValue, ...account };
                        console.log('Updated account:', updatedAccount);
                        this.accountSubject.next(updatedAccount);
                        
                        // Also update localStorage
                        const userJson = localStorage.getItem('user');
                        if (userJson) {
                            try {
                                const user = JSON.parse(userJson);
                                const updatedUser = { ...user, ...account };
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                console.log('Updated user in localStorage:', updatedUser);
                            } catch (e) {
                                console.error('Error updating user in localStorage:', e);
                            }
                        }
                    }
                    return account;
                }),
                catchError(error => {
                    console.error('Error in update method:', error);
                    return throwError(() => error);
                })
            );
    }

    delete(id: string | number) {
        return this.http.delete(`${this.baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id.toString() === this.accountValue?.id?.toString())
                    this.logout();
            }));
    }

    private startRefreshTokenTimer() {
        if (!this.accountValue?.jwtToken) return;
        
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }
}
