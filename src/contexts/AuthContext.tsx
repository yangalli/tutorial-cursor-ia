'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, Escola } from '@/types';

// Ações do reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ESCOLA'; payload: Escola | null }
  | { type: 'LOGIN'; payload: { user: User; escola: Escola } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Estado inicial
const initialState: AuthState = {
  user: null,
  escola: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer para gerenciar o estado
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    
    case 'SET_ESCOLA':
      return { ...state, escola: action.payload };
    
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        escola: action.payload.escola,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        escola: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    default:
      return state;
  }
}

// Contexto
interface AuthContextType extends AuthState {
  login: (user: User, escola: Escola) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setEscola: (escola: Escola) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Funções de autenticação
  const login = (user: User, escola: Escola) => {
    dispatch({ type: 'LOGIN', payload: { user, escola } });
    
    // Salvar no localStorage para persistência
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_escola', JSON.stringify(escola));
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    
    // Limpar localStorage
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_escola');
  };

  const updateUser = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    
    // Atualizar localStorage
    const currentUser = state.user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const setEscola = (escola: Escola) => {
    dispatch({ type: 'SET_ESCOLA', payload: escola });
    localStorage.setItem('auth_escola', JSON.stringify(escola));
  };

  // Verificar autenticação persistida ao carregar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        const savedEscola = localStorage.getItem('auth_escola');
        
        if (savedUser && savedEscola) {
          const user = JSON.parse(savedUser);
          const escola = JSON.parse(savedEscola);
          
          // Verificar se os dados não expiraram (opcional)
          const now = new Date();
          const userDate = new Date(user.updatedAt);
          const escolaDate = new Date(escola.updatedAt);
          
          // Se os dados são mais antigos que 24h, fazer logout
          if (now.getTime() - userDate.getTime() > 24 * 60 * 60 * 1000 ||
              now.getTime() - escolaDate.getTime() > 24 * 60 * 60 * 1000) {
            logout();
            return;
          }
          
          dispatch({ type: 'LOGIN', payload: { user, escola } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        logout();
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    setEscola,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
