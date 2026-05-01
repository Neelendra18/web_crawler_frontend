import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'qa' | 'dev';
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('airithm_session');
    if (data) {
      try {
        setUser(JSON.parse(data));
      } catch {
        // Ignore JSON parse errors
      }
    }
    console.log('AuthProvider mounted, user:', data);
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('airithm_session', JSON.stringify(user));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('airithm_session');
    // Dispatch event to force re-render in main.tsx
    window.dispatchEvent(new Event('airithm-logout'));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
