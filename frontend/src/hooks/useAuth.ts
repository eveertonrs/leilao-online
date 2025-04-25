// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [nome, setNome] = useState<string | null>(localStorage.getItem('nome'));
  const [tipo, setTipo] = useState<string | null>(localStorage.getItem('tipo'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedNome = localStorage.getItem('nome');
    const storedTipo = localStorage.getItem('tipo');
    setToken(storedToken);
    setNome(storedNome);
    setTipo(storedTipo);
  }, []);

  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('tipo');
    setToken(null);
    setNome(null);
    setTipo(null);
    window.location.href = '/login';
  };

  return { token, isAuthenticated, nome, tipo, logout };
};
