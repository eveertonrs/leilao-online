import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
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
        setDataInicio(evento.data_inicio.slice(0, 16)); // formato YYYY-MM-DDTHH:MM
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
      formData.append('foto_capa', imagem); // somente se imagem for alterada
    }
  
    try {
      await axios.put(`http://localhost:3333/eventos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Evento atualizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      alert('Erro ao atualizar evento');
    }
  };
  
  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
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

        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Alterar Imagem
          <input type="file" hidden onChange={handleImagemChange} />
        </Button>

        {preview && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Pré-visualização:</Typography>
            <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: 4 }} />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Atualizar
        </Button>
      </Paper>
    </Box>
  );
};

export default EditarEvento;
