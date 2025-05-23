import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '@prisma/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAdmin(data.user.role === 'ADMIN');
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to verify authentication:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        // Attempt to get error message from JSON, but fallback if it's not JSON
        let errorMessage = 'Invalid email or password';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          // If response.json() fails, it means the response was not valid JSON (e.g., HTML error page)
          const textResponse = await response.text(); // Get the raw text response
          console.error('Login API did not return JSON. Response:', textResponse);
          errorMessage = `Server error: Received non-JSON response. Status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      
      // If response.ok is true, we expect JSON
      const data = await response.json(); 
      setUser(data.user);
      setIsAdmin(data.user.role === 'ADMIN');
      localStorage.setItem('token', data.token);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          const textResponse = await response.text();
          console.error('Register API did not return JSON. Response:', textResponse);
          errorMessage = `Server error: Received non-JSON response. Status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setUser(data.user);
      setIsAdmin(data.user.role === 'ADMIN');
      localStorage.setItem('token', data.token);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    login,
    register,
    logout,
    error
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
