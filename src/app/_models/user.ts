export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    dateCreated?: Date;
    token?: string;
    jwtToken?: string; 
}

export interface RegisterRequest {
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}





