import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

export enum EmailStatus {
  Verifying,
  Failed,
  Success
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    
    console.log('VerifyEmailComponent: Received token:', token);

    if (!token) {
      console.error('VerifyEmailComponent: No token provided in URL');
      this.emailStatus = EmailStatus.Failed;
      return;
    }

    this.accountService.verifyEmail(token)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('VerifyEmailComponent: Email verification successful');
          this.emailStatus = EmailStatus.Success;
          this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
          setTimeout(() => {
            this.router.navigate(['../login'], { relativeTo: this.route });
          }, 2000);
        },
        error: (error) => {
          console.error('VerifyEmailComponent: Verification failed:', error);
          this.emailStatus = EmailStatus.Failed;
          this.alertService.error('Verification failed. Please try again or use the forgot password option.');
        }
      });
  }
}
