import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { CommonModule } from '@angular/common';

enum ResetStatus {
    Ready,
    Success
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['./forgot-password.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class ForgotPasswordComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    resetStatus = ResetStatus.Ready;
    countdown = 3;
    ResetStatus = ResetStatus;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            this.alertService.error('Please enter a valid email address');
            return;
        }

        this.loading = true;
        this.accountService.forgotPassword(this.f['email'].value)
            .pipe(
                first(),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: () => {
                    this.resetStatus = ResetStatus.Success;
                    this.startCountdown();
                },
                error: error => this.alertService.error(error)
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
