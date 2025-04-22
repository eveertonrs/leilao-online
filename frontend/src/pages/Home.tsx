import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

type Evento = {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  foto_capa?: string | null;
};

const Home = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const response = await axios.get<Evento[]>('http://localhost:3333/eventos');
        setEventos(response.data);
        console.log('Eventos:', response.data); // debug
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    }

    fetchEventos();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Eventos em Destaque
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
        mt={4}
      >
        {eventos.map((evento) => (
          <Card key={evento.id} sx={{ width: 300 }}>
            <CardMedia
              component="img"
              height="140"
              image={
                evento.foto_capa
                  ? `http://localhost:3333/uploads/${evento.foto_capa}`
                  : 'https://source.unsplash.com/400x200/?auction,event'
              }              
              alt={evento.nome}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {evento.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {evento.descricao || 'Sem descrição'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                to={`/eventos/${evento.id}`}
                variant="outlined"
              >
                Ver Detalhes
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
