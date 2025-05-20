import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'NORMAL';
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  setUsuario: (usuario: Usuario | null) => void;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  useEffect(() => {
    if (token && usuario) {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }, [token, usuario]);

  return (
    <AuthContext.Provider value={{ usuario, token, setUsuario, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export { AuthContext };
