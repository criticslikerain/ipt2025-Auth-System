import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';
import { AlertService } from '@app/_services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    standalone: true,
    imports: [CommonModule]
})
export class HomeComponent implements OnInit, OnDestroy {
    user: Account | null = null;
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private accountService: AccountService,
        private alertService: AlertService,
        private router: Router
    ) {
        // Get initial user value from account service
        this.user = this.accountService.accountValue;
        console.log('HomeComponent: Initial user value:', this.user);
        
        // Subscribe to account changes
        this.accountService.account
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                console.log('HomeComponent: Account updated:', user);
                this.user = user;
            });
    }

    ngOnInit() {
        console.log('HomeComponent: Initializing with user:', this.user);
        if (!this.user?.jwtToken) {
            console.log('HomeComponent: No JWT token found, redirecting to login');
            this.router.navigate(['/account/login']);
            return;
        }
        this.loadUserDetails();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadUserDetails() {
        if (!this.user?.id) {
            console.log('HomeComponent: No user ID found, redirecting to login');
            this.router.navigate(['/account/login']);
            return;
        }

        console.log('HomeComponent: Loading user details for ID:', this.user.id);
        this.loading = true;
        this.accountService.getById(this.user.id.toString())
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (user: Account) => {
                    console.log('HomeComponent: User details loaded successfully:', user);
                    this.user = user;
                },
                error: (error) => {
                    console.error('HomeComponent: Failed to fetch user details:', error);
                    if (error.status === 401) {
                        console.log('HomeComponent: Unauthorized, redirecting to login');
                        this.accountService.logout();
                        this.router.navigate(['/account/login']);
                    } else {
                        this.alertService.error('Failed to load user details. Please try again later.');
                    }
                }
            });
    }

    refreshUserDetails() {
        console.log('HomeComponent: Refreshing user details');
        this.loadUserDetails();
    }
}
