import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../utils/apiConfig';

axios.defaults.baseURL = BASE_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            if (storedUser && accessToken) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Failed to parse user", error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', token);
        // Clear landlord and admin loader flags so the animation runs on new login
        sessionStorage.removeItem('landlord_loaded');
        sessionStorage.removeItem('admin_loaded');
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('selectedTenantId');
        sessionStorage.removeItem('landlord_loaded');
        sessionStorage.removeItem('admin_loaded');
        setUser(null);
    };

    useEffect(() => {
        // Set up global axios interceptor for 401 errors
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.warn(`${error.response.status} Forbidden/Unauthorized detected. Logging out user.`);
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
