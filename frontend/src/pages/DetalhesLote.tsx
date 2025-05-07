import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper } from '@mui/material';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const DetalhesLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:3333/lotes/${id}`)
      .then(res => setLote(res.data))
      .catch(err => console.error('Erro ao carregar lote', err));
  }, [id]);

  if (!lote) return <Typography align="center" mt={4}>Carregando...</Typography>;

  console.log('Imagens retornadas:', lote.imagens);

  const imagens = lote.imagens?.map((url: string) => ({
    original: `http://localhost:3333${url}`,
    thumbnail: `http://localhost:3333${url}`
  })) || [];

  return (
    <Box sx={{ maxWidth: 960, margin: 'auto', padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Voltar
        </Button>

        <Typography variant="h4" gutterBottom>{lote.nome}</Typography>
        <Typography variant="subtitle1" gutterBottom>{lote.descricao}</Typography>
        <Typography>Lance mínimo: R$ {lote.lance_minimo}</Typography>
        <Typography>Início: {new Date(lote.data_inicio).toLocaleString()}</Typography>
        <Typography>Fim: {new Date(lote.data_fim).toLocaleString()}</Typography>

        {imagens.length > 0 && (
          <Box mt={3}>
            <ImageGallery
              items={imagens}
              showThumbnails={true}
              showFullscreenButton={true}
              showPlayButton={false}
              slideDuration={450}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DetalhesLote;
