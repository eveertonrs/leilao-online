import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditarEvento = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvento() {
      try {
        const response = await axios.get(`http://localhost:3333/eventos/${id}`);
        const evento = response.data;
        setNome(evento.nome);
        setDescricao(evento.descricao);
        setDataInicio(evento.data_inicio.slice(0, 16));
        setDataFim(evento.data_fim.slice(0, 16));
        if (evento.foto_capa) {
          setPreview(`http://localhost:3333/uploads/${evento.foto_capa}`);
        }
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
      }
    }

    fetchEvento();
  }, [id]);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagem(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim);

    if (imagem) {
      formData.append('foto_capa', imagem);
    }

    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:3333/eventos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Evento atualizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao atualizar evento:', error);
      if (error.response) {
        alert(`Erro do servidor: ${error.response.data.mensagem || 'Verifique os campos.'}`);
      } else {
        alert('Erro inesperado. Verifique o console.');
      }
    }
  };

  return (
    <Box sx={{
      background: 'linear-gradient(#f9f9f9, #e9f0f7)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: 6
    }}>
      <Paper elevation={4} sx={{ padding: 4, maxWidth: 500, width: '100%', borderRadius: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Voltar</Button>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Editar Evento
        </Typography>

        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <TextField
          label="Data Início"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />

        <TextField
          label="Data Fim"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Alterar Imagem
          <input type="file" hidden onChange={handleImagemChange} />
        </Button>

        {preview && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>Pré-visualização:</Typography>
            <Avatar src={preview} variant="rounded" sx={{ width: '100%', height: 200, borderRadius: 2 }} />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, fontWeight: 'bold' }}
          onClick={handleSubmit}
        >
          Atualizar
        </Button>
      </Paper>
    </Box>
  );
};

export default EditarEvento;
