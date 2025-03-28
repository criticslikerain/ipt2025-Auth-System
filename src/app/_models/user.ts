export interface User {
    id: string;
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    isVerified?: boolean;
    created?: Date;
    updated?: Date;
    password?: string;
    confirmPassword?: string;
    token?: string;
}



