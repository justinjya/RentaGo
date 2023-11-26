import React, { useState, useEffect, createContext, useContext } from 'react';
import { useSupabase } from './supabaseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoginPage, setShowLoginPage] = useState(false);
    const [showRegisterPage, setShowRegisterPage] = useState(false);

    const supabase = useSupabase();
    useEffect(() => {
        const checkAuthentication = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: loggedUser, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_id', user.id);

                if (loggedUser) {
                    setUsername(loggedUser[0].username);
                    setIsLoggedIn(true);
                }

                if (error) {
                    console.error('Error checking authentication:', error);
                }
            }
            setIsLoading(false)
        }

        checkAuthentication();
    })

    const login = (username) => {
        setUsername(username);
        setIsLoggedIn(true);
    }
    
    const logout = () => {
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, username, setUsername, isLoading, login, logout, 
            showLoginPage, setShowLoginPage, showRegisterPage, setShowRegisterPage }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
  }
