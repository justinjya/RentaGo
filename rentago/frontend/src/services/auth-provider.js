import React, { useState, useEffect, createContext } from 'react';
import { login, checkLogin } from './login';
import { register } from './register';
import { logout } from './logout';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [username, setUsername] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkUserLogin = async () => {
            setIsLoading(true)

            const data = await checkLogin()

            setIsLoggedIn(data.loggedIn)
            if (data.loggedIn) {
                setUsername(data.username)
            }
            else {
                setUsername(null)
            }
            setIsLoading(false)
        }
        
        checkUserLogin()
    }, [])

    const handleLogin = async (username, password) => {
        const response = await login(username, password)

        if (response) {
            const data = await checkLogin()
            setIsLoggedIn(data.loggedIn)
    
            if (data.loggedIn) {
                setUsername(username)
            }
            return true
        }
        return false
    }

    const handleRegister = async (username, email, password) => {
        const response = await register(username, email, password)

        if (response) {
            const loginData = await checkLogin()
            setIsLoggedIn(loginData.loggedIn)
    
            if (loginData.loggedIn) {
                setUsername(username)
                return true
            }
        }
        return false
    }

    const handleLogout = async () => {
        const response = await logout()

        if (response) {
            const loginData = await checkLogin()
            setIsLoggedIn(loginData.loggedIn)

            if (!loginData.loggedIn) {
                return true
            }
        }
        return false
    }

    return (
        <AuthContext.Provider value={{ isLoading, isLoggedIn, handleLogin, handleRegister, handleLogout, username }}>
            {isLoading !== true && children}
        </AuthContext.Provider>
    )
}