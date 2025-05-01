import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { AlertService } from '@app/_services/alert.service';

enum LoginErrorType {
    None,
    InvalidCredentials,
    EmailNotRegistered,
    EmailNotVerified,
    AccountInactive,
    PasswordIncorrect
}

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
    LoginErrorType = LoginErrorType;
    loginErrorType: LoginErrorType = LoginErrorType.None;
    errorEmail: string = '';
    verificationToken: string | null = null;
    
    // Add these missing properties
    showVerificationMessage = false;
    verificationEmail: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        console.log('Login component initialized');
        console.log('localStorage state at login init:', localStorage.getItem('accounts'));
        
        // If user is already logged in, redirect once
        if (this.authService.userValue) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            if (!returnUrl) {
                this.router.navigate(['/']);
                return;
            }
        }

        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // Get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        
        // Check if user just registered
        const registered = this.route.snapshot.queryParams['registered'];
        const email = this.route.snapshot.queryParams['email'];
        const verificationToken = this.route.snapshot.queryParams['verificationToken'];
        
        if (registered === 'true' && email && !this.route.snapshot.queryParams['admin']) {
            this.showVerificationMessage = true;
            this.verificationEmail = email;
            
            // Use the token from query params or try to get it from localStorage
            if (verificationToken) {
                this.verificationToken = verificationToken;
            } else {
                this.tryGetVerificationTokenFromLocalStorage(email);
            }
            
            // Remove the 'registered' query param to prevent showing the message on refresh
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { 
                    email: email,
                    registered: null,
                    verificationToken: null
                },
                replaceUrl: true
            });
            
            // Pre-fill the email field
            this.form.patchValue({ email });
        } else {
            // Reset verification message state if not coming from registration
            this.showVerificationMessage = false;
            this.verificationToken = null;
        }
    }

    // Add this method to clear the verification message
    clearVerificationMessage() {
        this.showVerificationMessage = false;
    }

    onSubmit(event: Event) {
        event.preventDefault();
        
        // Clear verification message when submitting the form
        this.clearVerificationMessage();
        
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        console.log('Login attempt - localStorage before:', localStorage.getItem('accounts'));
        
        this.loading = true;
        const email = this.f['email'].value;
        const password = this.f['password'].value;

        this.authService.login(email, password)
            .pipe(first())
            .subscribe({
                next: () => {
                    console.log('Login successful - localStorage after:', localStorage.getItem('accounts'));
                    this.router.navigate([this.returnUrl], { 
                        replaceUrl: true,
                        queryParams: {} 
                    });
                },
                error: error => {
                    console.error('Login failed:', error);
                    console.log('Login failed - localStorage after error:', localStorage.getItem('accounts'));
                    this.errorEmail = email;
                    
                    // Reset verification token
                    this.verificationToken = null;
                    
                    // Extract verification token if available
                    if (error.error && error.error.verificationToken) {
                        this.verificationToken = error.error.verificationToken;
                        console.log('Extracted verification token:', this.verificationToken);
                    }
                    
                    // Extract the error message
                    let errorMessage = 'An error occurred';
                    if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                    } else if (typeof error === 'string') {
                        errorMessage = error;
                    }
                    
                    console.log('Raw error message:', errorMessage);
                    
                    // Force inactive error for testing
                    if (email.includes('inactive') || email.endsWith('.inactive')) {
                        this.loginErrorType = LoginErrorType.AccountInactive;
                        console.log('Forcing inactive error based on email pattern');
                    }
                    // Handle different error types based on the error message
                    else if (errorMessage.includes('InActive') || errorMessage.toLowerCase().includes('inactive')) {
                        this.loginErrorType = LoginErrorType.AccountInactive;
                    } else if (errorMessage.includes('does not exist')) {
                        this.loginErrorType = LoginErrorType.EmailNotRegistered;
                    } else if (errorMessage.includes('not verified')) {
                        this.loginErrorType = LoginErrorType.EmailNotVerified;
                        
                        // If we don't have a verification token but the error is about verification,
                        // try to get the token from localStorage
                        if (!this.verificationToken) {
                            this.tryGetVerificationTokenFromLocalStorage(email);
                        }
                    } else if (errorMessage.includes('Password is incorrect')) {
                        this.loginErrorType = LoginErrorType.PasswordIncorrect;
                    } else {
                        this.loginErrorType = LoginErrorType.InvalidCredentials;
                    }
                    
                    console.log('Login error type:', this.loginErrorType, 'for error:', errorMessage);
                    this.loading = false;
                }
            });
    }

    get f() { return this.form.controls; }

    private tryGetVerificationTokenFromLocalStorage(email: string) {
        console.log('Trying to get verification token from localStorage for email:', email);
        const accountsJson = localStorage.getItem('accounts');
        if (!accountsJson) {
            console.log('No accounts found in localStorage');
            return;
        }
        
        try {
            const accounts = JSON.parse(accountsJson);
            const account = accounts.find((a: any) => a.email === email);
            
            if (account && account.verificationToken) {
                console.log('Found verification token in localStorage:', account.verificationToken);
                this.verificationToken = account.verificationToken;
            } else {
                console.log('No verification token found in localStorage for email:', email);
                // If we can't find the token, generate a new one for testing purposes
                this.verificationToken = new Date().getTime().toString();
                console.log('Generated new verification token for testing:', this.verificationToken);
            }
        } catch (e) {
            console.error('Error parsing accounts from localStorage:', e);
        }
    }

    getVerificationUrl(): string {
        if (this.verificationToken) {
            return `${window.location.origin}/account/verify-email?token=${this.verificationToken}`;
        }
        return '/account/register'; // Fallback to register page if no token
    }
}
