import { UserData, UserResponseType } from '../types/entityTypes';
import { api } from './config';

export const signUp = async (userData: UserData): Promise<UserResponseType> => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (err: any) {
        console.error('Sign up error:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message || 'An error occurred during sign up'
        };
    }
};

export const login = async (credentials: { email: string; password: string }): Promise<UserResponseType> => {
    try {
        const response = await api.post('/users/login', credentials);
        return response.data;
    } catch (err: any) {
        console.error('Login error:', err);
        return {
            success: false,
            message: err.response?.data?.message || err.message || 'An error occurred during login'
        };
    }
}; 