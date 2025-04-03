export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface Account {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    created: Date;
    jwtToken?: string;
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
