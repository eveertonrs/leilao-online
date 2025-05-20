import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { usuario, setUsuario, setToken } = useAuth();

  const logout = () => {
    setUsuario(null);
    setToken(null);
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

          {/* ADMIN - pode ver Novo Evento e Admin Lotes */}
          {usuario && usuario.tipo === 'ADMIN' && (
            <>
              <Button color="inherit" component={Link} to="/novo-evento">
                Novo Evento
              </Button>
              <Button color="inherit" component={Link} to="/admin-lotes">
                Admin Lotes
              </Button>
            </>
          )}

          {usuario ? (
            <>
              <Typography variant="body2" sx={{ mx: 2, display: 'inline-block' }}>
                Olá, {usuario.nome}
              </Typography>
              <Button color="inherit" onClick={logout}>
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
