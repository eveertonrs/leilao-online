import React, { useEffect, useState } from 'react';
import { Container,  Typography, Card, CardMedia, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid'; // ✅ forma correta
import axios from 'axios';

interface Evento {
  id: number;
  nome: string;
  data_inicio: string;
  data_fim: string;
  descricao: string;
  foto_capa: string | null;
}

const Home: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/eventos');
        setEventos(response.data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };

    fetchEventos();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Eventos em Destaque
      </Typography>
      <Grid container spacing={4}>
        {eventos.map((evento) => (
          // <Grid item  key={evento.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={evento.foto_capa || "https://via.placeholder.com/140x100"}
                alt={evento.nome}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {evento.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {evento.descricao}
                </Typography>
              </CardContent>
            </Card>
          //</Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
