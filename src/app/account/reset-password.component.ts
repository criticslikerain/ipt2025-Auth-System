import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { CommonModule } from '@angular/common';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

enum ResetStatus {
  Ready,
  Success
}

@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  ResetStatus = ResetStatus;
  tokenStatus = TokenStatus.Validating;
  resetStatus = ResetStatus.Ready;
  token: string | null = null;
  form!: FormGroup;
  loading = false;
  submitted = false;
  countdown = 3;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });

    const token = this.route.snapshot.queryParams['token'];

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { 
      relativeTo: this.route, 
      replaceUrl: true,
      queryParams: { token: null },
    });

    if (!token) {
      this.tokenStatus = TokenStatus.Invalid;
      return;
    }

    this.token = token;
    this.accountService.validateResetToken(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.tokenStatus = TokenStatus.Valid;
        },
        error: () => {
          this.tokenStatus = TokenStatus.Invalid;
        }
      });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.resetPassword(this.token!, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.resetStatus = ResetStatus.Success;
          this.startCountdown();
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  private startCountdown() {
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['../login'], { relativeTo: this.route });
      }
    }, 1000);
  }
}
