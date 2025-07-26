// src/context/AuthContext.tsx

import { createContext, useState, ReactNode } from "react";

export type AuthContextType = {
  user: { id: string; role: "manager" | "employee" } | null;
  setUser: (user: { id: string; role: "manager" | "employee" } | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
