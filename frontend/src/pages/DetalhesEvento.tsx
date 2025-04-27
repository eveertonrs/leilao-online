import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';

const DetalhesEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:3333/eventos/${id}`)
      .then(response => setEvento(response.data))
      .catch(error => console.error('Erro ao carregar evento:', error));
  }, [id]);

  if (!evento) return <Typography align="center" mt={4}>Carregando...</Typography>;

  return (
    <Box sx={{ maxWidth: 960, margin: 'auto', padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
          {evento.nome}
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img
            src={`http://localhost:3333/uploads/${evento.foto_capa}`}
            alt={evento.nome}
            style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', color: '#444' }}>
          {evento.descricao}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Datas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Início:</Typography>
            <Typography variant="body1">{new Date(evento.data_inicio).toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Fim:</Typography>
            <Typography variant="body1">{new Date(evento.data_fim).toLocaleString()}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Lotes */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
          🔨 Lotes Disponíveis
        </Typography>

        <Typography variant="body2" color="text.secondary">
          (Nenhum lote ainda - funcionalidade em construção)
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Rodapé */}
        <Box textAlign="center">
          <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
            Participe do leilão e aproveite oportunidades exclusivas!
          </Typography>
          <Box>
            <button
              style={{
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.3s',
              }}
              onClick={() => alert('Funcionalidade futura: participação no leilão')}
            >
              Participe do Leilão
            </button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DetalhesEvento;
