import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { getItem, saveItem, deleteItem } from '../services/storage'; // We'll create this

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getItem('admin_token'));

  const login = (newToken: string) => {
    saveItem('admin_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    deleteItem('admin_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};