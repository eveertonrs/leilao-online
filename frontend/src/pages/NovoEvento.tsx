import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Avatar,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

const NovoEvento = () => {
  const navigate = useNavigate();
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
      reader.onloadend = () => setPreview(reader.result as string);
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
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3333/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert('Evento criado com sucesso!');
      setNome('');
      setDescricao('');
      setDataInicio('');
      setDataFim('');
      setImagem(null);
      setPreview(null);
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar evento';
      alert(`Erro ao criar evento: ${mensagem}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-card rounded-md shadow-card p-8">
        <Button onClick={() => navigate(-1)} variant="outlined"   >
          Voltar
        </Button>

         <Typography variant="h5" gutterBottom fontWeight={600}   className="text-text-primary">
          Novo Evento
        </Typography>

        <Divider className="mb-3" />

        <TextField label="Nome" fullWidth margin="normal" value={nome} onChange={(e) => setNome(e.target.value)}    InputLabelProps={{ shrink: true }}  />
        <TextField label="Descrição" fullWidth margin="normal" multiline rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)}  InputLabelProps={{ shrink: true }} />
        <TextField label="Data Início" type="datetime-local" fullWidth margin="normal"   InputLabelProps={{ shrink: true }} value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <TextField label="Data Fim" type="datetime-local" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={dataFim} onChange={(e) => setDataFim(e.target.value)} />

        <Button variant="outlined" component="label"   >
          Escolher Imagem
          <input type="file" hidden onChange={handleImagemChange} />
        </Button>

        {preview && (
          <Box   className="mt-3 text-center">
            <Typography variant="subtitle1" gutterBottom className="text-text-secondary">Pré-visualização:</Typography>
            <Avatar src={preview} variant="rounded" className="w-full h-52 mx-auto" />
          </Box>
        )}

        <Button variant="contained" color="primary" fullWidth   onClick={handleSubmit}>
          Salvar Evento
        </Button>
      </div>
    </div>
  );
};

export default NovoEvento;
