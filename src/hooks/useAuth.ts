'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        // global interceptor for 401s
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const hasPermission = (permission: string) => {
        if (!user) return false;
        
        switch (user.role) {
            case 'Owner':
                return true;
            case 'Manager':
                return ['leads', 'ads', 'dashboard', 'settings'].includes(permission);
            case 'Agent':
                return ['leads', 'dashboard', 'settings'].includes(permission);
            default:
                return false;
        }
    };

    return { user, loading, logout, hasPermission };
}
