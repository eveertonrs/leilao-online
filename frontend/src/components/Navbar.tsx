// src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Leilões
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {/* Apenas ADMIN pode ver "Novo Evento" */}
          {usuario && usuario.tipo === 'ADMIN' && (
            <Button color="inherit" component={Link} to="/novo-evento">
              Novo Evento
            </Button>
          )}

          {/* Usuário logado */}
          {usuario ? (
            <>
              <Typography variant="body2" sx={{ mx: 2, display: 'inline-block' }}>
                Olá, {usuario.nome}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
