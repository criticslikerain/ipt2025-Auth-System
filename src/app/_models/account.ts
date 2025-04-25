export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface Account {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
    jwtToken?: string;
    created?: Date;
    updated?: Date;
    isVerified?: boolean;
    password?: string;
}

export interface AccountWithDelete extends Account {
    isDeleting: boolean;
}

export interface AccountResponse extends Account {
    token: string;
}

export interface RegisterRequest {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}
