import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/api';
import ApiService from '../services/ApiService';

interface AuthContextType {
    state: AuthState;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
    | { type: 'LOGIN'; payload: { token: string; user: User } }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    console.log('AuthReducer called with action:', action.type, 'payload' in action ? action.payload : 'no payload');

    switch (action.type) {
        case 'LOGIN':
            const newState = {
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };
            console.log('AuthReducer LOGIN - new state:', newState);
            return newState;
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                user: null,
                token: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const token = ApiService.getAuthToken();
        const user = ApiService.getCurrentUser();

        console.log('Initializing auth state from localStorage:', { token, user });

        if (token && user) {
            console.log('Valid token and user found, setting authenticated state');
            dispatch({ type: 'LOGIN', payload: { token, user } });
        } else {
            console.log('No valid auth data found in localStorage');
        }
    }, []);

    const login = (token: string, user: User) => {
        console.log('AuthContext login called with:', { token, user });

        // Save to localStorage first
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Saved to localStorage - token:', token, 'user:', user);

        // Then dispatch to update state
        dispatch({ type: 'LOGIN', payload: { token, user } });
        console.log('Login dispatch completed, new state should be authenticated');
    };

    const logout = () => {
        ApiService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = (user: User) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    const value: AuthContextType = {
        state,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
