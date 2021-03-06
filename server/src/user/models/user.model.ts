export interface User {
    id?: number
    name?: string
    username?: string
    email?: string
    password?: string
    role?: UserRole;
    profileImage?: string;
    //blogEntries?: BlogEntry[];
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEF_EDITOR = 'chief_editor',
    EDITOR = 'editor',
    USER = 'user'
}