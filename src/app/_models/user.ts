export type Role = 'User' | 'Admin';

export interface User {
    id: string;
    email: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    token?: string;
    jwtToken?: string;
    refreshToken?: string;
}

