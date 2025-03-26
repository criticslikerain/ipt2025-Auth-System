import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token: string | null = null;
  form!: UntypedFormGroup; 
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });

    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.tokenStatus = TokenStatus.Invalid;
      return;
    }

    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.accountService.validateResetToken(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.token = token;
          this.tokenStatus = TokenStatus.Valid;
        },
        error: () => {
          this.tokenStatus = TokenStatus.Invalid;
        }
      });
  }

  get f() {
    return this.form.controls; 
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) return;

    this.loading = true;
    this.accountService.resetPassword(this.token!, this.f['password'].value, this.f['confirmPassword'].value) 
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
