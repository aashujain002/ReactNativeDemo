import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token_v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const saved = await EncryptedStorage.getItem(TOKEN_KEY);
                if (saved) setToken(saved);
            } catch (e) {
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'reqres-free-v1'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');
            if (data.token) {
                await EncryptedStorage.setItem(TOKEN_KEY, data.token);
                setToken(data.token);
                return true;
            }
            throw new Error('Token missing');
        } catch (e) {
            return false;
        }
    };

    const logout = async () => {
        setToken(null);
        try { await EncryptedStorage.removeItem(TOKEN_KEY); } catch (e) { }
    };

    return (
        <AuthContext.Provider value={{ token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
