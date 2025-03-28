import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';

import { Account } from '../_models/account';
import { AccountService } from '../_services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    standalone: true,
    imports: [CommonModule]
})
export class HomeComponent implements OnInit {
    user: Account | null;
    loading = false;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.loading = true;
        this.accountService.getById(this.user?.id!)
            .pipe(first())
            .subscribe({
                next: (user) => {
                    this.loading = false;
                    this.user = user;
                },
                error: (error) => {
                    console.error('Error fetching user:', error);
                    this.loading = false;
                }
            });
    }

    logout() {
        this.accountService.logout();
    }
}
