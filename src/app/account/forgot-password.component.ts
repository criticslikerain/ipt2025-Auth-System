import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less'],
  encapsulation: ViewEncapsulation.None  
})
export class ForgotPasswordComponent implements OnInit {
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
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

    this.accountService.forgotPassword(this.f['email'].value)
      .pipe(
        first(),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => this.alertService.success('✅ Please check your email for password reset instructions'),
        error: error => this.alertService.error(error)
      });
  }
}
