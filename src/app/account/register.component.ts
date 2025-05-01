import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { RegisterRequest } from '@app/_models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { MustMatch } from '@app/_helpers/must-match.validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    registrationSuccess = false;
    isFirstUserRegistered = false;
    verificationMessage: string = '';
    registrationError: string = ''; 

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validators: MustMatch('password', 'confirmPassword')
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.registrationError = ''; // Clear any previous errors

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const registrationData = this.form.value;
        
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: (response: any) => {
                    if (response?.isFirstUser) {
                        this.isFirstUserRegistered = true;
                        this.alertService.success('Admin registration successful. You can login immediately.', 
                            { keepAfterRouteChange: true, autoClose: false });
                        
                        // Redirect to login page after a longer delay (5 seconds instead of 1.5)
                        setTimeout(() => {
                            this.router.navigate(['/account/login'], { 
                                queryParams: { 
                                    email: this.f['email'].value,
                                    registered: true,
                                    admin: true
                                }
                            });
                        }, 5000); // Changed from 1500 to 5000 milliseconds
                    } else {
                        this.registrationSuccess = true;
                        
                        // Store verification token in localStorage for retrieval
                        const verificationToken = response?.verificationToken;
                        if (verificationToken) {
                            try {
                                // Store in a separate verification tokens object
                                const tokensJson = localStorage.getItem('verificationTokens') || '{}';
                                const tokens = JSON.parse(tokensJson);
                                tokens[this.f['email'].value] = verificationToken;
                                localStorage.setItem('verificationTokens', JSON.stringify(tokens));
                                console.log('Stored verification token for email:', this.f['email'].value);
                            } catch (e) {
                                console.error('Error storing verification token:', e);
                            }
                        }
                        
                        // Redirect to login page with query params
                        this.router.navigate(['/account/login'], { 
                            queryParams: { 
                                email: this.f['email'].value,
                                registered: true,
                                verificationToken: verificationToken
                            }
                        });
                    }
                    this.loading = false;
                },
                error: error => {
                    this.registrationError = error;
                    this.loading = false;
                    this.alertService.error(error);
                }
            });
    }
}
