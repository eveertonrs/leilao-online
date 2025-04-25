import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Evento = {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  foto_capa?: string | null;
};

const banners = [
  'https://sba1.com/arquivos/leiloes/2019/02/leilao-especial-gado-de-corte-leiloforte.jpg',
  'https://sba1.com/arquivos/leiloes/2019/Virtual%20MS%20Leil%C3%B5es.jpeg',
  'https://souagro.net/wp-content/uploads/2021/08/gado.jpg',
];

const Home = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos(filtro: 'todos' | 'ativos' | 'futuros' = 'todos') {
    try {
      const response = await axios.get<Evento[]>('http://localhost:3333/eventos');
      let data = response.data;

      const agora = new Date();

      if (filtro === 'ativos') {
        data = data.filter(e => new Date(e.data_inicio) <= agora && new Date(e.data_fim) >= agora);
      } else if (filtro === 'futuros') {
        data = data.filter(e => new Date(e.data_inicio) > agora);
      }

      setEventos(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  }

  const handleExcluir = async (id: number) => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir este evento?');
    if (!confirmacao) return;
  
    try {
      const token = localStorage.getItem('token'); // ✅ Pegue o token
      await axios.delete(`http://localhost:3333/eventos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // ✅ Envie o token no header
        }
      });
  
      alert('Evento excluído com sucesso!');
      // Atualizar a lista após exclusão (dependendo da lógica que você usa)
    } catch (error) {
      console.error('Erro ao excluir o evento:', error);
      alert('Erro ao excluir o evento');
    }
  };
  

  return (
    <Box sx={{ background: 'linear-gradient(#f9f9f9, #e9f0f7)', py: 6 }}>
      <Container>

        {/* Carrossel com banners externos */}
        <Slider autoplay dots infinite speed={700} slidesToShow={1} slidesToScroll={1}>
          {banners.map((url, index) => (
            <Box key={index}>
              <img src={url} alt={`Banner ${index + 1}`} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
            </Box>
          ))}
        </Slider>

        {/* Título */}
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mt: 4, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 1 }}>
          Leilões em Destaque
        </Typography>

        {/* Filtros */}
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="outlined" onClick={() => fetchEventos('todos')}>Todos</Button>
          <Button variant="outlined" onClick={() => fetchEventos('ativos')}>Ativos</Button>
          <Button variant="outlined" onClick={() => fetchEventos('futuros')}>Futuros</Button>
        </Box>

        {/* Lista de Eventos */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={4}
          mt={4}
        >
          {eventos.map((evento) => (
            <Card
              key={evento.id}
              sx={{
                width: 300,
                borderRadius: 3,
                boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={
                  evento.foto_capa
                    ? `http://localhost:3333/uploads/${evento.foto_capa}`
                    : 'https://source.unsplash.com/400x200/?auction,event'
                }
                alt={evento.nome}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {evento.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden' }}>
                  {evento.descricao || 'Sem descrição'}
                </Typography>
                <Chip
                  label={`Início: ${new Date(evento.data_inicio).toLocaleDateString()}`}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  component={Link}
                  to={`/eventos/${evento.id}`}
                  variant="contained"
                  color="primary"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Detalhes
                </Button>
                <Box>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/editar-evento/${evento.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleExcluir(evento.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
