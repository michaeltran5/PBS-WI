import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUidByEmail, loadUserData, isUserDataLoaded } from './csvParser';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggingIn: boolean;
}

interface User {
  email: string;
  uid: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  //check for exisitng session
  useEffect(() => {
    const checkSession = () => {
      const userSession = sessionStorage.getItem('user');
      
      if (userSession) {
        try {
          const userData = JSON.parse(userSession);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Session restored for user:', userData.email);
          console.log('User UID:', userData.uid);
        } catch (error) {
          console.error('Failed to parse user session:', error);
          sessionStorage.removeItem('user');
        }
      }
    };

    checkSession();
  }, []);

  //login func
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      
      if (!email.includes('@example.com')) {
        console.log('Invalid email format');
        return false;
      }
      
      //load user data from csv
      if (!isUserDataLoaded()) {
        loadUserData();
        await loadUserData();
      }
      
      //get uid is userdata is succesfuly loaded
      let uid = getUidByEmail(email);
      
      //only allows logging in to existing users on the csv
        if (!uid) {
        console.log('User not found in CSV data. Login rejected for:', email);
        return false;
      }
      
      console.log('Found existing user in CSV data with UID:', uid);
      
      //user object with uid and email
      const userData: User = {email, uid};
      
      //store it in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(userData));

      console.log(`User ${email}, UID: ${uid}`);

      window.location.reload();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  //logout func
  const logout = () => {
    sessionStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    window.location.reload();
    
    console.log('User logged out');
  };

  //auth context values
  const value = { isAuthenticated, user, login, logout, isLoggingIn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//auth context hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};