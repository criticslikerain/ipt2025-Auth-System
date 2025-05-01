import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AccountService, AlertService } from '@app/_services';
import { Account, AccountWithDelete } from '@app/_models/account';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class ListComponent implements OnInit, OnDestroy {
    accounts: AccountWithDelete[] = [];
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.loadAccounts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getStatusClass(status: string | undefined): string {
        if (!status) return 'status-inactive';
        return status === 'Active' ? 'status-active' : 'status-inactive';
    }

    private loadAccounts(): void {
        this.loading = true;
        this.alertService.clear();

        this.accountService.getAll()
            .pipe(
                first(),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (accounts) => {
                    this.accounts = accounts.map(account => ({
                        ...account,
                        status: account.status === 'Inactive' ? 'Inactive' : 'Active',
                        isDeleting: false
                    }));
                    this.loading = false;
                },
                error: (error: HttpErrorResponse) => {
                    this.alertService.error('Error loading accounts. Please try again.');
                    this.loading = false;
                    console.error('Error loading accounts:', error);
                }
            });
    }

    deleteAccount(id: number): void {  // Changed from string to number
        if (!id) {
            this.alertService.error('Invalid account ID');
            return;
        }

        const account = this.accounts.find(x => x.id === id);
        
        if (!account) {
            this.alertService.error('Account not found');
            return;
        }

        if (account.isDeleting) {
            return;
        }

        const accountName = [account.title, account.firstName, account.lastName]
            .filter(Boolean)
            .join(' ');

        if (confirm(`Are you sure you want to delete ${accountName}'s account?`)) {
            account.isDeleting = true;

            this.accountService.delete(id)
                .pipe(
                    first(),
                    takeUntil(this.destroy$)
                )
                .subscribe({
                    next: () => {
                        this.accounts = this.accounts.filter(x => x.id !== id);
                        this.alertService.success('Account deleted successfully');
                    },
                    error: error => {
                        account.isDeleting = false;
                        this.alertService.error('Error deleting account');
                    }
                });
        }
    }

    refreshList(): void {
        this.loadAccounts();
    }
}
