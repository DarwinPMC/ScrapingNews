import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/verify-role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setUserRole(response.data.rol);
                setUserName(localStorage.getItem('userName'));
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName, userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
