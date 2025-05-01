import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first, tap } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({ 
    templateUrl: 'details.component.html',
    styleUrls: ['./details.component.less'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class DetailsComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    account: any = null;
    id: string | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        // Get the ID from the route parameters if available
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        console.log('Route parameter ID:', this.id);

        // Initialize the form first
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validators: MustMatch('password', 'confirmPassword')
        });

        // If we have an ID from the route, use that to load the account
        if (this.id) {
            this.loadAccountById(this.id);
        } 
        // Otherwise, load the current user's account
        else if (this.accountService.accountValue) {
            this.loadUserDetails();
        } 
        // If no account in service, try to load from localStorage
        else {
            this.loadFromLocalStorage();
        }
    }

    private loadAccountById(id: string) {
        console.log('Loading account by ID:', id);
        this.loading = true;
        
        this.accountService.getById(id)
            .pipe(
                tap(account => console.log('Account data received for ID', id, ':', account)),
                first()
            )
            .subscribe({
                next: account => {
                    console.log('Processing account data for ID', id, ':', account);
                    this.account = account;
                    this.form.patchValue(account);
                    this.loading = false;
                },
                error: error => {
                    console.error('Error loading account data for ID', id, ':', error);
                    this.alertService.error('Failed to load account data');
                    this.loading = false;
                    
                    // Try to load from localStorage as fallback
                    this.loadSpecificAccountFromLocalStorage(id);
                }
            });
    }

    private loadUserDetails() {
        // Load current user details
        const userId = this.accountService.accountValue?.id;
        if (userId) {
            console.log('Fetching details for current user ID:', userId);
            this.loadAccountById(userId.toString());
        } else {
            console.error('No user ID found in accountService.accountValue');
            this.alertService.error('User information not found. Please log in again.');
            this.router.navigate(['/account/login']);
        }
    }
    
    private loadFromLocalStorage() {
        console.log('Attempting to load account from localStorage');
        const accountsJson = localStorage.getItem('accounts');
        if (!accountsJson) {
            console.error('No accounts found in localStorage');
            this.router.navigate(['/account/login']);
            return;
        }
        
        try {
            const accounts = JSON.parse(accountsJson);
            
            // If we have an ID, load that specific account
            if (this.id) {
                this.loadSpecificAccountFromLocalStorage(this.id);
                return;
            }
            
            // Otherwise load the current user's account
            const currentUserJson = localStorage.getItem('user');
            if (currentUserJson) {
                const currentUser = JSON.parse(currentUserJson);
                console.log('Current user from localStorage:', currentUser);
                
                // First try to find by ID if available
                let userAccount = null;
                if (currentUser.id) {
                    userAccount = accounts.find((a: any) => a.id.toString() === currentUser.id.toString());
                    console.log('Searching for account with ID:', currentUser.id, 'Result:', userAccount);
                }
                
                // If not found by ID, try by email
                if (!userAccount && currentUser.email) {
                    userAccount = accounts.find((a: any) => a.email === currentUser.email);
                    console.log('Searching for account with email:', currentUser.email, 'Result:', userAccount);
                }
                
                // If still not found, try by jwtToken
                if (!userAccount && currentUser.jwtToken) {
                    const tokenParts = currentUser.jwtToken.split('.');
                    if (tokenParts.length === 3) {
                        try {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            if (payload.id) {
                                userAccount = accounts.find((a: any) => a.id.toString() === payload.id.toString());
                                console.log('Searching for account with token ID:', payload.id, 'Result:', userAccount);
                            }
                        } catch (e) {
                            console.error('Error parsing JWT token:', e);
                        }
                    }
                }
                
                if (userAccount) {
                    console.log('Loaded user account from localStorage:', userAccount);
                    this.account = userAccount;
                    this.form.patchValue(userAccount);
                } else {
                    console.error('User account not found in accounts array');
                    this.alertService.error('User account not found. Please log in again.');
                    this.router.navigate(['/account/login']);
                }
            } else {
                console.error('No current user found in localStorage');
                this.router.navigate(['/account/login']);
            }
        } catch (e) {
            console.error('Error parsing localStorage data:', e);
            this.router.navigate(['/account/login']);
        }
    }
    
    private loadSpecificAccountFromLocalStorage(id: string) {
        console.log('Loading specific account from localStorage with ID:', id);
        const accountsJson = localStorage.getItem('accounts');
        if (!accountsJson) {
            console.error('No accounts found in localStorage');
            return;
        }
        
        try {
            const accounts = JSON.parse(accountsJson);
            const account = accounts.find((a: any) => a.id.toString() === id);
            
            if (account) {
                console.log('Found account in localStorage with ID', id, ':', account);
                this.account = account;
                this.form.patchValue(account);
            } else {
                console.error('Account with ID', id, 'not found in localStorage');
                this.alertService.error('Account not found');
            }
        } catch (e) {
            console.error('Error parsing localStorage data:', e);
        }
    }

    // Convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        // Only include password if provided
        const formData = {...this.form.value};
        if (!formData.password) {
            delete formData.password;
            delete formData.confirmPassword;
        }

        const id = this.id || this.account?.id || this.accountService.accountValue?.id;
        if (!id) {
            this.alertService.error('User ID not found');
            this.loading = false;
            return;
        }

        this.accountService.update(id.toString(), formData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    onCancel() {
        this.router.navigate(['/']);
    }
}
