import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import api from '../lib/api';
import { getItem, saveItem, deleteItem } from '../lib/storage';

// Define the shape of the user's credentials
interface Credentials {
  name: string;
  passport: string;
}

// Define the shape of the context value
interface AuthContextType {
  account: string | null;
  token: string | null;
  signer: ethers.Signer | null;
  credentials: Credentials | null;
  loading: boolean;
  connectWallet: () => Promise<void>;
  login: (token: string, creds: Credentials) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize state from localStorage to persist session
  const [token, setToken] = useState<string | null>(() => getItem('token'));
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    const creds = getItem('credentials');
    return creds ? JSON.parse(creds) : null;
  });
  
  const navigate = useNavigate();

  // Effect to set auth header on initial load if token exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  // Function to update the auth state after a successful login/registration
  const login = (newToken: string, creds: Credentials) => {
    saveItem('token', newToken);
    saveItem('credentials', JSON.stringify(creds));
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setCredentials(creds);
  };

  // Function to handle the entire connection and login flow
  const connectWallet = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signerInstance = await provider.getSigner();
      const walletAddress = await signerInstance.getAddress();

      setAccount(walletAddress);
      setSigner(signerInstance);

      const checkRes = await api.get(`/auth/check/${walletAddress}`);
      const { isRegistered } = checkRes.data;

      if (isRegistered) {
        // If user exists, perform the sign-in with ethereum flow
        const nonceRes = await api.get(`/auth/nonce/${walletAddress}`);
        const { nonce } = nonceRes.data;
        const signature = await signerInstance.signMessage(nonce);
        const loginRes = await api.post(`/auth/login`, { walletAddress, signature });
        
        const { token: newToken, credentials: userCredentials } = loginRes.data;
        login(newToken, userCredentials); // Use the login function to set state
        
        navigate('/dashboard', { replace: true });
      } else {
        // If user is new, redirect them to the registration page
        navigate('/register');
      }
    } catch (err: any) {
      console.error("Connection failed:", err);
      alert(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear all session data and log out
  const logout = () => {
    setAccount(null);
    setToken(null);
    setSigner(null);
    setCredentials(null);
    deleteItem('token');
    deleteItem('credentials');
    delete api.defaults.headers.common['Authorization'];
    navigate('/', { replace: true });
  };
  
  return (
    <AuthContext.Provider value={{ account, token, signer, credentials, loading, connectWallet, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};