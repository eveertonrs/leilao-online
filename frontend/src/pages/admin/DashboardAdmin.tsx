import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  Box,
  Button,
  Card,
  Divider,
  Typography
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LayersIcon from '@mui/icons-material/Layers';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
  <Card
    elevation={2}
    className="flex items-center p-3 flex-1 min-w-[280px]"
  >
    <Box className="rounded-full w-14 h-14 flex items-center justify-center mr-2" style={{ backgroundColor: color }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" className="text-text-secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold" className="text-text-primary">
        {value}
      </Typography>
    </Box>
  </Card>
);

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalLots, setTotalLots] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [eventData, setEventData] = useState<{ month: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventosResponse = await axios.get('http://localhost:3333/eventos');
        setTotalEvents(eventosResponse.data.length);

        const lotesResponse = await axios.get('http://localhost:3333/lotes');
        setTotalLots(lotesResponse.data.length);

        const usuariosResponse = await axios.get('http://localhost:3333/usuarios');
        setTotalUsers(usuariosResponse.data.length);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }

      try {
        const eventosResponse = await axios.get('http://localhost:3333/eventos');
        const evs = eventosResponse.data as any[];
        const counts: Record<string, number> = {};
        evs.forEach(ev => {
          const m = new Date(ev.data_inicio).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
          counts[m] = (counts[m] || 0) + 1;
        });
        setEventData(Object.entries(counts).map(([month, count]) => ({ month, count })));
      } catch (error) {
        console.error('Erro ao buscar dados para o gráfico:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p={4} className="font-sans">
      <Typography variant="h4" fontWeight="bold" gutterBottom className="text-text-primary">
        Painel de Controle
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {/* Cards */}
      <Box
        className="flex flex-wrap gap-3 justify-start mb-5"
      >
        <StatCard
          title="Total de Eventos"
          value={totalEvents}
          icon={<EventIcon color="primary" />}
          color="secondary"
        />
        <StatCard
          title="Total de Lotes"
          value={totalLots}
          icon={<LayersIcon color="primary" />}
          color="secondary"
        />
        <StatCard
          title="Total de Usuários"
          value={totalUsers}
          icon={<GroupIcon color="primary" />}
          color="secondary"
        />
      </Box>

      {/* Gráfico de Eventos por Mês */}
      <Box className="w-full h-[300px] mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={eventData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip />
            <Bar dataKey="count" fill="#2962ff" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Ações rápidas */}
      <Typography variant="h6" fontWeight="medium" gutterBottom className="text-text-primary">
        Ações Rápidas
      </Typography>
      <Box className="flex flex-wrap gap-2">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/novo-evento')}
          className="min-w-[220px] bg-primary hover:bg-secondary text-white font-bold"
        >
          Criar Novo Evento
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/novo-lote')}
          className="min-w-[220px] text-primary hover:bg-secondary hover:text-white font-bold"
        >
          Criar Novo Lote
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardAdmin;
