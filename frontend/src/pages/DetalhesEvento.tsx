import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper } from '@mui/material';

const DetalhesEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:3333/eventos/${id}`)
      .then(response => setEvento(response.data))
      .catch(error => console.error('Erro ao carregar evento:', error));
  }, [id]);

  if (!evento) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>{evento.nome}</Typography>
        <img
          src={`http://localhost:3333/uploads/${evento.foto_capa}`}
          alt={evento.nome}
          style={{ width: '100%', borderRadius: 8 }}
        />
        <Typography variant="body1" sx={{ mt: 2 }}>{evento.descricao}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Início: {new Date(evento.data_inicio).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Fim: {new Date(evento.data_fim).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DetalhesEvento;
