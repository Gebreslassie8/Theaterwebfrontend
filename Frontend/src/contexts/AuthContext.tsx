import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'venue_manager' | 'theater_owner' | 'user';
  avatar: string;
  profileImage?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; data?: User; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('theatrehub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; data?: User; error?: string }> => {
    // Simulate API call
    const mockUsers: Record<string, User> = {
      'admin@theatrehub.com': {
        id: 1,
        email: 'admin@theatrehub.com',
        name: 'Admin User',
        role: 'admin',
        avatar: 'A'
      },
      'manager@venue.com': {
        id: 2,
        email: 'manager@venue.com',
        name: 'Venue Manager',
        role: 'venue_manager',
        avatar: 'V'
      },
      'owner@theater.com': {
        id: 3,
        email: 'owner@theater.com',
        name: 'Theater Owner',
        role: 'theater_owner',
        avatar: 'T'
      },
      'user@example.com': {
        id: 4,
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        avatar: 'U'
      },
    };

    if (mockUsers[email] && password === 'password') {
      const userData = mockUsers[email];
      setUser(userData);
      localStorage.setItem('theatrehub_user', JSON.stringify(userData));
      return { success: true, data: userData };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('theatrehub_user');
  };

  const updateUser = (updates: Partial<User>): void => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('theatrehub_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};