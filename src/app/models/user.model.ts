export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export interface User {
    id: string;
    email: string;
    password: string; // In production, this would be hashed on backend
    name: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    savedAddresses?: SavedAddress[];
    notifications?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
}

export interface SavedAddress {
    id: string;
    label: string; // 'Home', 'Work', etc.
    address: string;
}

export interface AuthSession {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
    loginTime: Date;
}
