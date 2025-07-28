// File: frontend/src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type AppRole = 'admin' | 'user' | null;

interface AuthContextValue {
  token: string | null;
  role: AppRole;
}

// 1) Create the context with defaults
const AuthContext = createContext<AuthContextValue>({
  token: null,
  role: null,
});

// 2) Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole]   = useState<AppRole>(null);

  useEffect(() => {
    // Read from localStorage on mount
    const storedToken = localStorage.getItem('authToken');
    const storedRole  = (localStorage.getItem('userRole') as AppRole) || null;

    setToken(storedToken);
    setRole(storedRole);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3) Hook for consuming
export const useAuth = () => {
  return useContext(AuthContext);
};
