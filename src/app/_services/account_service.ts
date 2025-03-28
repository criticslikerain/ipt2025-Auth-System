import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { Account, Role, ApiResponse } from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class AccountServices {
    private currentUserSubject: BehaviorSubject<Account | null>;
    public currentUser: Observable<Account | null>;
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.currentUserSubject = new BehaviorSubject<Account | null>(this.getStoredUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // Getter for current user value
    public get currentUserValue(): Account | null {
        return this.currentUserSubject.value;
    }

    // Authentication Methods
    signIn(email: string, password: string): Observable<Account> {
        return this.http.post<ApiResponse<Account>>(`${environment.apiUrl}/auth/signin`, { email, password })
            .pipe(
                map(response => {
                    const user = response.data!;
                    this.storeUserData(user);
                    this.currentUserSubject.next(user);
                    this.autoLogout(user.jwtToken);
                    return user;
                }),
                catchError(this.handleError)
            );
    }

    signOut(): void {
        localStorage.removeItem('userData');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    // User Management Methods
    createAccount(userData: Partial<Account>): Observable<Account> {
        return this.http.post<ApiResponse<Account>>(`${environment.apiUrl}/users/create`, userData)
            .pipe(
                map(response => response.data!),
                catchError(this.handleError)
            );
    }

    updateAccount(userId: string, updates: Partial<Account>): Observable<Account> {
        return this.http.put<ApiResponse<Account>>(`${environment.apiUrl}/users/${userId}`, updates)
            .pipe(
                tap(response => {
                    if (userId === this.currentUserValue?.id) {
                        const updatedUser = { ...this.currentUserValue, ...response.data };
                        this.storeUserData(updatedUser);
                        this.currentUserSubject.next(updatedUser);
                    }
                }),
                map(response => response.data!),
                catchError(this.handleError)
            );
    }

    deleteAccount(userId: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/users/${userId}`)
            .pipe(
                tap(() => {
                    if (userId === this.currentUserValue?.id) {
                        this.signOut();
                    }
                }),
                catchError(this.handleError)
            );
    }

    // Password Management
    changePassword(currentPassword: string, newPassword: string): Observable<void> {
        return this.http.post<ApiResponse<void>>(`${environment.apiUrl}/users/change-password`, {
            currentPassword,
            newPassword
        }).pipe(catchError(this.handleError));
    }

    requestPasswordReset(email: string): Observable<void> {
        return this.http.post<ApiResponse<void>>(`${environment.apiUrl}/users/reset-password-request`, { email })
            .pipe(catchError(this.handleError));
    }

    // Profile Management
    updateProfile(updates: Partial<Account>): Observable<Account> {
        const userId = this.currentUserValue?.id;
        if (!userId) return throwError(() => 'User not authenticated');

        return this.updateAccount(userId, updates);
    }

    // Authorization Methods
    hasPermission(role: Role): boolean {
        return this.currentUserValue?.role === role;
    }

    isAuthenticated(): boolean {
        return !!this.currentUserValue;
    }

    // Private Helper Methods
    private storeUserData(user: Account): void {
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private getStoredUser(): Account | null {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    private autoLogout(token: string | undefined): void {
        if (!token) return;

        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = (tokenData.exp * 1000) - Date.now();
            
            this.tokenExpirationTimer = setTimeout(() => {
                this.signOut();
            }, expirationTime);
        } catch (error) {
            console.error('Token parsing error:', error);
        }
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.error?.message || error.message;
        }

        return throwError(() => errorMessage);
    }

    // Utility Methods
    getFullName(user: Account): string {
        return `${user.firstName} ${user.lastName}`.trim();
    }

    formatUserRole(role: Role): string {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
}