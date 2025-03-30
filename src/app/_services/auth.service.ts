import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject: BehaviorSubject<any>;
    public user: Observable<any>;
    private logoutSubject = new BehaviorSubject<boolean>(false);
    public logoutState = this.logoutSubject.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient,
        private storage: StorageService
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(this.storage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/account/login`, { email: username, password })
            .pipe(map(user => {
                // Store user details and jwt token in local storage to keep user logged in between page refreshes
                this.storage.setItem('user', JSON.stringify(user));
                // Notify all subscribers that user has changed
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        this.logoutSubject.next(true);
        setTimeout(() => {
            // Remove user from storage
            this.storage.removeItem('user');
            this.userSubject.next(null);
            this.logoutSubject.next(false);
            this.router.navigate(['/account/login']);
        }, 3000);
    }
}






