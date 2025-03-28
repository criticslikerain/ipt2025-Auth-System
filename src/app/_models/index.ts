export * from './account';
export * from './alert';
export * from './role';

// Response interfaces
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

// Request interfaces
export interface LoginRequest {
    email: string;
    password: string;
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

export interface UpdateRequest {
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

// Pagination interface
export interface PaginatedResult<T> {
    items: T[];
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

// Filter interface
export interface FilterParams {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
