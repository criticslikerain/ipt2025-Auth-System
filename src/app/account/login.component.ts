import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { AlertService } from '@app/_services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string = '/';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.accountService.accountValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        console.log('LoginComponent: Attempting login...');
        
        this.accountService.login(this.f['email'].value, this.f['password'].value)
            .pipe(first())
            .subscribe({
                next: (account) => {
                    console.log('LoginComponent: Login successful', {
                        account: account,
                        hasToken: !!account.jwtToken,
                        returnUrl: this.returnUrl
                    });
                    if (account.jwtToken) {
                        this.router.navigate([this.returnUrl || '/']);
                    } else {
                        console.error('LoginComponent: No JWT token received');
                        this.alertService.error('Login failed: No authentication token received');
                        this.loading = false;
                    }
                },
                error: error => {
                    console.error('LoginComponent: Login error:', error);
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
