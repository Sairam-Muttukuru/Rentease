import React, { createContext, useContext, useState, useEffect } from 'react';

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
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); // If used
        setUser(null);
        window.location.reload(); // Hard reset state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
