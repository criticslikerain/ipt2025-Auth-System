import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    standalone: true,
    imports: [CommonModule]
})
export class HomeComponent implements OnInit {
    user: Account | null = null;
    loading = false;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.accountValue;
    }

    ngOnInit() {
        this.loading = true;
        if (this.user?.id) {
            this.accountService.getById(this.user.id)
                .pipe(first())
                .subscribe({
                    next: (user: Account) => {
                        this.user = user;
                        this.loading = false;
                    },
                    error: (error) => {
                        console.error('Failed to fetch user details:', error);
                        this.loading = false;
                    }
                });
        } else {
            this.loading = false;
        }
    }
}
