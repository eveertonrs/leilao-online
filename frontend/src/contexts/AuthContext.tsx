import { createContext, useState, useEffect, ReactNode } from 'react';

type Usuario = {
  nome: string;
  tipo: string; // 'ADMIN' ou outro
};

type AuthContextType = {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const storedUser = localStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      console.log('🔐 Usuário logado:', usuario); // <-- AQUI
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
