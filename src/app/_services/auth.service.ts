import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User | null>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/accounts/authenticate`, { email, password })
            .pipe(
                map(user => {
                    // Ensure the response includes the JWT token
                    user.token = user.jwtToken || user.token; // Handle both token formats
                    
                    // Store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    console.log('User stored in localStorage after login:', user);
                    
                    this.userSubject.next(user);
                    return user;
                }),
                catchError(error => {
                    console.error('Login error details:', error);
                    // Pass through the entire error object to preserve additional data
                    return throwError(() => error);
                })
            );
    }

    getUserDetails(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/accounts/${id}`);
    }

    logout() {
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }
}
















