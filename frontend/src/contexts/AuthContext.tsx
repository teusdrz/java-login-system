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
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
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
    
    if (token && user) {
      dispatch({ type: 'LOGIN', payload: { token, user } });
    }
  }, []);

  const login = (token: string, user: User) => {
    dispatch({ type: 'LOGIN', payload: { token, user } });
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
