export interface User {
    error: string;
    status: boolean;
    accessToken?: string;
    refreshToken?: string;
    name: string;
    userId: number;
}
