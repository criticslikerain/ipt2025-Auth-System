export class Account {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: boolean;
    verificationToken?: string;
    verified?: Date;
    resetToken?: string;
    resetTokenExpires?: Date;
    passwordReset?: Date;
    created?: Date;
    updated?: Date;
    isVerified?: boolean;
    jwtToken?: string;
    refreshToken?: string;

    constructor(init?: Partial<Account>) {
        Object.assign(this, init);
    }
}

export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface TokenResponse {
    token: string;
    refreshToken: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface VerifyEmailRequest {
    token: string;
}
