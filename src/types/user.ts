export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
