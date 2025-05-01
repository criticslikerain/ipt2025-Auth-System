import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { CommonModule } from '@angular/common';

export enum EmailStatus {
    Verifying,
    Success,
    AlreadyVerified,
    Failed
}

@Component({
    selector: 'app-verify-email',
    templateUrl: 'verify-email.component.html',
    styleUrls: ['./verify-email.component.less'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class VerifyEmailComponent implements OnInit {
    EmailStatus = EmailStatus;
    emailStatus = EmailStatus.Verifying;
    countdown = 5;
    countdownInterval: any;
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        console.log('VerifyEmailComponent initialized');
        console.log('Current localStorage state:', localStorage.getItem('accounts'));
        
        const token = this.route.snapshot.queryParams['token'];

        if (!token) {
            console.error('No token provided in URL');
            this.emailStatus = EmailStatus.Failed;
            this.errorMessage = 'No verification token was provided in the URL.';
            this.alertService.error('Verification failed. No token provided.');
            return;
        }

        console.log('Attempting to verify token:', token);

        // Remove token from URL but keep the accounts in localStorage
        this.router.navigate([], { 
            relativeTo: this.route, 
            replaceUrl: true,
            queryParams: { token: null },
        });

        // Log localStorage before verification
        console.log('localStorage before verification request:', localStorage.getItem('accounts'));

        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
                next: (response: any) => {
                    console.log('Verification response:', response);
                    console.log('Final localStorage state:', localStorage.getItem('accounts'));
                    
                    if (response && response.alreadyVerified) {
                        this.emailStatus = EmailStatus.AlreadyVerified;
                        this.alertService.info('Your email has already been verified. You can now login.', { keepAfterRouteChange: true });
                    } else {
                        this.emailStatus = EmailStatus.Success;
                        this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    }
                    
                    this.startCountdown();
                },
                error: (error) => {
                    console.error('Verification failed:', error);
                    console.log('Current localStorage state after error:', localStorage.getItem('accounts'));
                    this.emailStatus = EmailStatus.Failed;
                    this.errorMessage = error?.message || 'Verification failed. Please try again or use the forgot password option.';
                    this.alertService.error(this.errorMessage);
                }
            });
    }

    startCountdown() {
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.countdownInterval);
                this.router.navigate(['../login'], { relativeTo: this.route });
            }
        }, 1000);
    }

    ngOnDestroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}
