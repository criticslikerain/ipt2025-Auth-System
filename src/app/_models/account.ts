export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface Account {
    id: number;  // Changed back to number to match the implementation
    title?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    role: Role;
    status?: string;
    verificationToken?: string;
    verified?: Date;
    resetToken?: string;
    resetTokenExpires?: string;
    refreshTokens: string[];
    dateCreated: string;
    isVerified: boolean;
    jwtToken?: string;
}

export interface AccountWithDelete extends Account {
    isDeleting?: boolean;
}

export interface AccountResponse extends Account {
    jwtToken: string;
}

export interface RegisterRequest {
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    department?: string;
    position?: string;
    contactNumber?: string;
    address?: string;
    acceptTerms: boolean;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}
