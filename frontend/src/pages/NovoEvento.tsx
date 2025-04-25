import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar
} from '@mui/material';

const NovoEvento = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagem(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!imagem) return alert('Selecione uma imagem!');
  
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim);
    formData.append('foto_capa', imagem);
  
    try {
      const token = localStorage.getItem('token'); // ✅ Pega o token salvo no login
      await axios.post('http://localhost:3333/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // ✅ Adiciona o token
        },
      });
  
      alert('Evento criado com sucesso!');
      // Limpar os campos
      setNome('');
      setDescricao('');
      setDataInicio('');
      setDataFim('');
      setImagem(null);
      setPreview(null);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento');
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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Novo Evento
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
          Escolher Imagem
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
          Salvar
        </Button>
      </Paper>
    </Box>
  );
};

export default NovoEvento;
