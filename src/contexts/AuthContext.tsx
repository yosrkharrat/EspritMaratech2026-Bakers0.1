import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { authenticate, getUser, initStore } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isVisitor: boolean;
  login: (name: string, cin: string) => { success: boolean; error?: string };
  loginAsVisitor: () => void;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
  isAdmin: boolean;
  isCoach: boolean;
  isGroupAdmin: boolean;
  canCreateEvents: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVisitor, setIsVisitor] = useState(false);

  useEffect(() => {
    initStore();
    const savedUserId = localStorage.getItem('rct_currentUser');
    const savedVisitor = localStorage.getItem('rct_visitor');
    if (savedUserId) {
      const u = getUser(savedUserId);
      if (u) setUser(u);
    } else if (savedVisitor) {
      setIsVisitor(true);
    }
  }, []);

  const login = (name: string, cin: string) => {
    const u = authenticate(name, cin);
    if (u) {
      setUser(u);
      setIsVisitor(false);
      localStorage.setItem('rct_currentUser', u.id);
      localStorage.removeItem('rct_visitor');
      return { success: true };
    }
    return { success: false, error: 'Nom ou code CIN invalide' };
  };

  const loginAsVisitor = () => {
    setUser(null);
    setIsVisitor(true);
    localStorage.setItem('rct_visitor', 'true');
    localStorage.removeItem('rct_currentUser');
  };

  const logout = () => {
    setUser(null);
    setIsVisitor(false);
    localStorage.removeItem('rct_currentUser');
    localStorage.removeItem('rct_visitor');
  };

  const hasRole = (...roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = hasRole('admin');
  const isCoach = hasRole('coach');
  const isGroupAdmin = hasRole('group_admin');
  const canCreateEvents = hasRole('admin', 'coach', 'group_admin');
  const canManageUsers = hasRole('admin');

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isVisitor,
      login,
      loginAsVisitor,
      logout,
      hasRole,
      isAdmin,
      isCoach,
      isGroupAdmin,
      canCreateEvents,
      canManageUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
