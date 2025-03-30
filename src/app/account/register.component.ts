import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { AlertComponent } from '@app/_components/alert.component';
import { RegisterRequest } from '@app/_models';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        AlertComponent
    ]
})
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    registrationSuccess = false;
    registrationError = ''; // Add this line

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
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

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        this.registrationError = '';

        if (this.form.invalid) {
            return;
        }

        const registrationData: RegisterRequest = {
            title: this.form.get('title')?.value,
            firstName: this.form.get('firstName')?.value,
            lastName: this.form.get('lastName')?.value,
            email: this.form.get('email')?.value,
            password: this.form.get('password')?.value,
            confirmPassword: this.form.get('confirmPassword')?.value,
            acceptTerms: this.form.get('acceptTerms')?.value
        };

        this.loading = true;
        this.accountService.register(registrationData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.registrationSuccess = true;
                    this.registrationError = '';
                    
                    setTimeout(() => {
                        this.router.navigate(['../login'], { relativeTo: this.route });
                    }, 2000);
                },
                error: error => {
                    this.loading = false;
                    this.registrationSuccess = false;
                    
                    // Specific error handling
                    if (error.error?.message?.toLowerCase().includes('email') || 
                        error.error?.toLowerCase().includes('email')) {
                        this.registrationError = 'Email already registered!';
                    } else {
                        this.registrationError = 'Email already registered!';
                    }
                },
                complete: () => {
                    this.loading = false;
                }
            });
    }
}
