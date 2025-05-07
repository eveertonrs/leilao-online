import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Divider, CardMedia, CardContent, Button
} from '@mui/material';

const DetalhesEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<any>(null);
  const [lotes, setLotes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3333/eventos/${id}`)
        .then(response => setEvento(response.data))
        .catch(error => console.error('Erro ao carregar evento:', error));

      axios.get(`http://localhost:3333/lotes/evento/${id}`)
        .then(response => setLotes(response.data))
        .catch(error => console.error('Erro ao carregar lotes:', error));
    }
  }, [id]);

  if (!evento) return <Typography align="center" mt={4}>Carregando...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#fff' }}>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
          🔨 Lotes Disponíveis
        </Typography>

        {lotes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum lote cadastrado para este evento.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
            }}
          >
            {lotes.map((lote) => (
              <Paper
                key={lote.id}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 24px)',
                    md: 'calc(33.33% - 24px)',
                  },
                  p: 2,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {lote.imagens?.length > 0 && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={`http://localhost:3333${lote.imagens[0]}`}
                    alt={lote.nome}
                    sx={{ borderRadius: 1, mb: 1, objectFit: 'cover', width: '100%' }}
                  />
                )}
                <CardContent sx={{ padding: 0, width: '100%' }}>
                  <Typography variant="h6" gutterBottom>{lote.nome}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{lote.descricao}</Typography>
                  <Typography variant="body2">Lance mínimo: R$ {lote.lance_minimo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Início: {new Date(lote.data_inicio).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fim: {new Date(lote.data_fim).toLocaleString()}
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(`/lotes/${lote.id}`)}>
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Paper>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

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
