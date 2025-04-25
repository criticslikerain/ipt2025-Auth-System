import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Account } from '@app/_models/account';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
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
        this.user = this.accountService.accountValue;
        
        this.accountService.account
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                this.user = user;
            });
    }

    ngOnInit() {
        if (!this.user?.jwtToken) {
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
            this.router.navigate(['/account/login']);
            return;
        }

        this.loading = true;
        this.accountService.getById(this.user.id.toString())
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (user: Account) => {
                    this.user = user;
                },
                error: (error) => {
                    if (error.status === 401) {
                        this.accountService.logout();
                        this.router.navigate(['/account/login']);
                    } else {
                        this.alertService.error('Failed to load user details');
                    }
                }
            });
    }
}
