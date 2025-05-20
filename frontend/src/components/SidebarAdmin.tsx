import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import LayersIcon from '@mui/icons-material/Layers';
import { Link } from 'react-router-dom';

const SidebarAdmin = () => {
  const menu = [
    { label: 'Dashboard', icon: <DashboardIcon />, to: '/admin/dashboard' },
    { label: 'Eventos', icon: <EventIcon />, to: '/admin/eventos' },
    { label: 'Lotes', icon: <LayersIcon />, to: '/admin/lotes' }
  ];

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: '#1976d2',
        color: 'white',
        minHeight: '100vh',
        px: 2,
        pt: 3
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Administração
      </Typography>
      <List>
        {menu.map((item, index) => (
          <ListItemButton
            key={index}
            component={Link}
            to={item.to}
            sx={{
              color: 'white',
              borderRadius: 1,
              mb: 1,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default SidebarAdmin;
