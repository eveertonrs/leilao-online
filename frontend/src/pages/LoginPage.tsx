import { useState, useContext } from 'react'; // ⬅️ Adicione useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { AuthContext } from '../contexts/AuthContext'; // ⬅️ Importe o Contexto

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext); // ⬅️ Pegue o setUsuario do contexto

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3333/auth/login', { email, senha });
      const { token, usuario } = response.data;

      // Armazena token e atualiza o contexto
      localStorage.setItem('token', token);
      setUsuario(usuario); // ⬅️ Atualiza o estado global

      alert(`Bem-vindo, ${usuario.nome}!`);
      navigate('/');
    } catch (error) {
      alert('Email ou senha inválidos');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Email"
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
