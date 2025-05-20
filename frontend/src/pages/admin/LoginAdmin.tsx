import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const LoginAdmin: React.FC = () => {
  const { setUsuario, setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await axios.post('http://localhost:3333/auth/login', {
        email,
        senha,
      });

      const usuario = res.data.usuario;

      if (usuario.tipo !== 'ADMIN') {
        setErro('Acesso restrito ao painel administrativo.');
        return;
      }

      setUsuario(usuario);
      setToken(res.data.token);
      navigate('/admin');
    } catch (error) {
      setErro('Credenciais inválidas.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Login Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {erro}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Entrar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginAdmin;
