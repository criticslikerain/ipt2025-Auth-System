import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

// Define interfaces for type safety
interface Account {
    id: number;
    title?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    role: Role;
    verificationToken?: string;
    verified?: Date;
    resetToken?: string;
    resetTokenExpires?: string;
    refreshTokens: string[];
    dateCreated: string;
    isVerified: boolean;
    status?: string;
    confirmPassword?: string;
}

const accountsKey = 'accounts';

// Initialize accounts array from localStorage
let accounts: Account[] = [];

export const fakeBackendInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    const { url, method, headers, body } = request;
    const alertService = inject(AlertService);

    // Load accounts from localStorage on each request
    const accountsJson = localStorage.getItem(accountsKey);
    console.log('Loading accounts from localStorage:', accountsJson);
    accounts = accountsJson ? JSON.parse(accountsJson) : [];
    
    // Ensure accounts array is initialized if localStorage is empty
    if (!accounts || !Array.isArray(accounts)) {
        accounts = [];
    }

    return handleRoute();

    function handleRoute(): Observable<HttpEvent<any>> {
        console.log('Fake backend processing request:', { url, method, body });
        console.log('Current accounts in storage:', accounts);
        
        // Add test routes for debugging
        if (url.endsWith('/test-error')) {
            const errorType = body.errorType || 'default';
            switch(errorType) {
                case 'email-not-exist':
                    return error('Email does not exist');
                case 'password-incorrect':
                    return error('Password is incorrect');
                case 'not-verified':
                    return error('Email is not verified. Please check your inbox to verify.');
                case 'inactive':
                    return error('Account is InActive. Please contact system administrator!');
                default:
                    return error('Test error message');
            }
        }
        
        switch (true) {
            case url.endsWith('/accounts/authenticate'):
                return authenticate();
            case url.endsWith('/accounts/register'):
                return register();
            case url.endsWith('/accounts/verify-email') && method === 'POST':
                return verifyEmail();
            case url.includes('/accounts/verify-email') && method === 'GET':
                // Handle GET verification with token from URL
                return verifyEmail();
            case url.endsWith('/accounts/forgot-password'):
                return forgotPassword();
            case url.endsWith('/accounts/validate-reset-token'):
                return validateResetToken();
            case url.endsWith('/accounts/reset-password'):
                return resetPassword();
            case url.endsWith('/accounts') && method === 'GET':
                return getAccounts();
            case url.match(/\/accounts\/\d+$/) && method === 'GET':
                return getAccountById();
            case url.endsWith('/accounts') && method === 'POST':
                return createAccount();
            case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                return updateAccount();
            case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                return deleteAccount();
            default:
                return next(request);
        }
    }

    function verifyEmail() {
        let tokenToVerify: string;
        
        // Debug logging
        console.log('Starting email verification');
        console.log('Current accounts in storage:', localStorage.getItem(accountsKey));
        
        // Load fresh data from localStorage
        const freshAccounts = localStorage.getItem(accountsKey);
        if (freshAccounts) {
            accounts = JSON.parse(freshAccounts);
        }
        
        if (method === 'POST' && body?.token) {
            tokenToVerify = body.token;
        } else if (method === 'GET' && url.includes('token=')) {
            tokenToVerify = url.split('token=')[1];
        } else {
            return error('Verification token is required');
        }
        
        console.log('Verifying token:', tokenToVerify);
        console.log('Available accounts:', accounts);
        
        const account = accounts.find(x => x.verificationToken === tokenToVerify);
        
        if (!account) {
            console.log('No account found with token:', tokenToVerify);
            // Check if any account exists but has already been verified (token removed)
            const possiblyVerifiedAccount = accounts.find(x => 
                x.isVerified && !x.verificationToken && x.status === 'Active');
            
            if (possiblyVerifiedAccount) {
                console.log('Found already verified account:', possiblyVerifiedAccount);
                return ok({ alreadyVerified: true });
            }
            
            return error('Verification failed - invalid token');
        }
        
        // Update account
        account.isVerified = true;
        account.status = 'Active';
        delete account.verificationToken;
        
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
        // Verify storage was successful
        console.log('Updated accounts in localStorage:', localStorage.getItem(accountsKey));
        
        return ok();
    }

    function forgotPassword() {
        const { email } = body;
        const account = accounts.find(x => x.email === email);
        
        if (!account) return ok();
        
        account.resetToken = new Date().getTime().toString();
        account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
        return ok();
    }

    function validateResetToken() {
        const { token } = body;
        const account = accounts.find(x => 
            x.resetToken === token && 
            new Date() < new Date(x.resetTokenExpires!)
        );
        
        if (!account) return error('Invalid token');
        
        return ok();
    }

    function resetPassword() {
        const { token, password } = body;
        const account = accounts.find(x => 
            x.resetToken === token && 
            new Date() < new Date(x.resetTokenExpires!)
        );
        
        if (!account) return error('Invalid token');
        
        account.password = password;
        delete account.resetToken;
        delete account.resetTokenExpires;
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
        return ok();
    }

    function getAccounts() {
        if (!isAuthenticated()) return unauthorized();
        return ok(accounts.map(x => basicDetails(x)));
    }

    function getAccountById() {
        if (!isAuthenticated()) return unauthorized();
        
        const id = idFromUrl();
        const account = accounts.find(x => x.id === id);
        
        if (!account) return error('Account not found');
        
        return ok(basicDetails(account));
    }

    function createAccount() {
        const account = body;

        if (accounts.find(x => x.email === account.email)) {
            return error(`Email ${account.email} is already registered`);
        }

        // Create new account
        const newAccount: Account = {
            id: newAccountId(),  // Keep as number
            title: account.title,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            password: account.password,
            role: accounts.length === 0 ? Role.Admin : Role.User,
            status: accounts.length === 0 ? 'Active' : 'Pending',
            dateCreated: new Date().toISOString(),
            refreshTokens: [],
            isVerified: accounts.length === 0
        };

        accounts.push(newAccount);
        localStorage.setItem(accountsKey, JSON.stringify(accounts));

        return ok();
    }

    function updateAccount() {
        if (!isAuthenticated()) return unauthorized();
        
        const id = idFromUrl();
        const account = accounts.find(x => x.id === id);
        
        if (!account) return error('Account not found');
        
        Object.assign(account, body);
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
        return ok();
    }

    function deleteAccount() {
        if (!isAuthenticated()) return unauthorized();
        
        const id = idFromUrl();
        accounts = accounts.filter(x => x.id !== id);
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
        return ok();
    }

    // Helper functions
    function ok(body?: any) {
        return of(new HttpResponse({ status: 200, body }))
            .pipe(delay(500));
    }

    // Helper function to return error response
    function error(message: string, data = {}) {
        console.log('Returning error:', message, 'with data:', data);
        return throwError(() => ({ 
            error: { 
                message,
                ...data
            } 
        }))
        .pipe(materialize(), delay(500), dematerialize());
    }

    function unauthorized() {
        return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
            .pipe(materialize(), delay(500), dematerialize());
    }

    function basicDetails(account: Account) {
        const { 
            id, 
            title,
            firstName, 
            lastName, 
            email, 
            role, 
            status,
            dateCreated, 
            isVerified 
        } = account;
        
        return { 
            id, 
            title,
            firstName, 
            lastName, 
            email, 
            role, 
            status,
            dateCreated, 
            isVerified 
        };
    }

    function isAuthenticated() {
        const authHeader = headers.get('Authorization');
        return authHeader?.startsWith('Bearer fake-jwt-token');
    }

    function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
    }

    function newAccountId() {
        return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
    }

    function generateJwtToken(): string {
        return 'fake-jwt-token.' + new Date().getTime();
    }

    function authenticate() {
        const { email, password } = body;
        console.log('Attempting authentication with:', { email, password });
        console.log('Current accounts:', accounts);
        
        // Check if email exists
        const account = accounts.find(x => x.email === email);
        
        if (!account) {
            console.log('No account found with email:', email);
            return error('Email does not exist');
        }
        
        // Check password
        if (account.password !== password) {
            console.log('Password incorrect for email:', email);
            return error('Password is incorrect');
        }

        // Check if account is active
        if (account.status?.toLowerCase() === 'inactive') {
            console.log('Account inactive for email:', email);
            return error('Account is InActive. Please contact system administrator!');
        }

        // Check if email is verified
        if (!account.isVerified) {
            console.log('Account not verified for email:', email);
            // Return the verification token along with the error
            return error('Email is not verified. Please check your inbox to verify.', { 
                verificationToken: account.verificationToken 
            });
        }

        const response = {
            ...basicDetails(account),
            jwtToken: generateJwtToken()
        };
        console.log('Authentication successful, returning:', response);
        
        account.refreshTokens = account.refreshTokens || [];
        account.refreshTokens.push(generateJwtToken());
        localStorage.setItem(accountsKey, JSON.stringify(accounts));

        return ok(response);
    }

    function register() {
        const account = body;

        if (accounts.find(x => x.email === account.email)) {
            return error(`Email ${account.email} is already registered`);
        }

        // Create new account with verification token
        const verificationToken = new Date().getTime().toString();
        
        const newAccount: Account = {
            id: newAccountId(),
            title: account.title,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            password: account.password,
            role: accounts.length === 0 ? Role.Admin : Role.User,
            status: accounts.length === 0 ? 'Active' : 'Pending',
            dateCreated: new Date().toISOString(),
            refreshTokens: [],
            isVerified: accounts.length === 0,
            verificationToken: accounts.length === 0 ? undefined : verificationToken
        };

        // First user (Admin) is automatically verified
        if (accounts.length === 0) {
            newAccount.isVerified = true;
            accounts.push(newAccount);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            console.log('Admin account created:', newAccount);
            console.log('Accounts after admin creation:', localStorage.getItem(accountsKey));
            return ok({ isFirstUser: true });
        } else {
            // Regular user needs verification
            accounts.push(newAccount);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            console.log('Regular account created:', newAccount);
            console.log('Accounts after user creation:', localStorage.getItem(accountsKey));
            
            // Show verification email with the correct token
            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${verificationToken}`;
                alertService.info(`
                    <h4>Verification Email</h4>
                    <p>Thanks for registering!</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> This is a simulated email for testing purposes.</div>
                `, { autoClose: false });
            }, 1000);
            
            return ok({ verificationToken });
        }
    }

    function clearAllAccounts() {
        localStorage.removeItem(accountsKey);
        accounts = [];
    }

    function logout() {
        // Don't remove accounts from localStorage, just clear the current session
        // localStorage.removeItem(accountsKey);
        // accounts = [];
        return ok();
    }
};
