import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { AlertService } from '@app/_services/alert.service';
import { User } from '@app/_models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    standalone: true,
    imports: [CommonModule, DatePipe]
})
export class HomeComponent implements OnInit, OnDestroy {
    user: User | null = null;
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router
    ) {
        this.user = this.authService.userValue;
        
        this.authService.user
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (user) => {
                    this.user = user;
                    if (!user) {
                        this.router.navigate(['/account/login']);
                    }
                },
                error: (error) => {
                    console.error('Error in user subscription:', error);
                    this.alertService.error('Error loading user data');
                }
            });
    }

    ngOnInit(): void {
        if (!this.user) {
            this.router.navigate(['/account/login']);
            return;
        }
        this.loadUserDetails();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadUserDetails(): void {
        if (!this.user?.id) {
            return;
        }

        this.loading = true;
        this.authService.getUserDetails(this.user.id)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (user) => {
                    this.user = user;
                },
                error: (error) => {
                    console.error('Error loading user details:', error);
                    if (error.status === 401) {
                        this.authService.logout();
                        this.router.navigate(['/account/login']);
                    } else {
                        this.alertService.error('Failed to load user details');
                    }
                }
            });
    }
}
