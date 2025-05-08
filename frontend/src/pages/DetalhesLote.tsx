import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Paper, TextField, List, ListItem, ListItemText, Divider, Alert
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { AuthContext } from '../contexts/AuthContext';

const DetalhesLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [lote, setLote] = useState<any>(null);
  const [lances, setLances] = useState<any[]>([]);
  const [maiorLance, setMaiorLance] = useState<number>(0);
  const [novoLance, setNovoLance] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:3333/lotes/${id}`).then(res => setLote(res.data));
    axios.get(`http://localhost:3333/lances/lote/${id}`).then(res => setLances(res.data));
    axios.get(`http://localhost:3333/lances/maior-lance/${id}`).then(res => setMaiorLance(res.data?.valor || 0));
  }, [id]);

  const enviarLance = () => {
    setErro(null);
    setSucesso(null);

    if (!usuario) return setErro('Você precisa estar logado para dar um lance.');
    const valor = parseFloat(novoLance);
    if (isNaN(valor)) return setErro('Digite um valor válido.');
    if (valor < lote.lance_minimo) return setErro(`O lance deve ser maior ou igual a R$ ${lote.lance_minimo}.`);
    if (valor <= maiorLance) return setErro(`O lance deve ser maior que o lance atual de R$ ${maiorLance}.`);

    const confirmar = window.confirm(`Tem certeza que deseja dar o lance de R$ ${valor.toFixed(2)}?`);
    if (!confirmar) return;

    axios.post('http://localhost:3333/lances/lance', {
      valor,
      usuario_id: usuario.id,
      lote_id: id
    })
    .then(() => {
      setNovoLance('');
      setSucesso('Lance enviado com sucesso!');
      return Promise.all([
        axios.get(`http://localhost:3333/lances/lote/${id}`),
        axios.get(`http://localhost:3333/lances/maior-lance/${id}`)
      ]);
    })
    .then(([resLances, resMaior]) => {
      setLances(resLances.data);
      setMaiorLance(resMaior.data?.valor || 0);
    })
    .catch(() => setErro('Erro ao enviar o lance.'));
  };

  if (!lote) return <Typography align="center" mt={4}>Carregando...</Typography>;

  const imagens = lote.imagens?.map((url: string) => ({ original: url, thumbnail: url })) || [];

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>← Voltar</Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{lote.nome}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>{lote.descricao}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Lance mínimo:</strong> R$ {lote.lance_minimo}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Início:</strong> {new Date(lote.data_inicio).toLocaleString()}</Typography>
        <Typography sx={{ mb: 2 }}><strong>Fim:</strong> {new Date(lote.data_fim).toLocaleString()}</Typography>

        {imagens.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <ImageGallery items={imagens} showThumbnails showFullscreenButton showPlayButton={false} slideDuration={450} additionalClass="custom-gallery" />
          </Box>
        )}

        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" gutterBottom>📢 Lances</Typography>
        <Typography sx={{ mb: 2 }}><strong>Maior lance atual:</strong> R$ {maiorLance}</Typography>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

        <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          {lances.map((lance, index) => (
            <ListItem
              key={index}
              divider
              sx={{
                bgcolor: lance.valor === maiorLance ? 'primary.main' : 'transparent',
                color: lance.valor === maiorLance ? 'white' : 'inherit',
                borderRadius: 1
              }}
            >
              <ListItemText
                primary={
                  <>
                    {lance.valor === maiorLance && <EmojiEventsIcon fontSize="small" sx={{ mr: 1 }} />}
                    R$ {lance.valor}
                  </>
                }
                secondary={`Usuário: ${lance.usuario} - ${new Date(lance.data_lance).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>

        {usuario ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Seu lance"
              type="number"
              value={novoLance}
              onChange={e => setNovoLance(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
            <Button variant="contained" onClick={enviarLance}>Enviar</Button>
          </Box>
        ) : (
          <Typography color="text.secondary">Faça login para dar um lance.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DetalhesLote;
