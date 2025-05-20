// frontend/src/pages/AdminLotes.tsx
import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Box, Button, Typography, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const AdminLotes = () => {
  const [lotes, setLotes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<any | null>(null);
  const [imagensNovas, setImagensNovas] = useState<File[]>([]);
  const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
  const [imagensRemovidas, setImagensRemovidas] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nome: '', descricao: '', lance_minimo: '', data_inicio: '', data_fim: '', evento_id: '', categoria_id: ''
  });

  const [eventos, setEventos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    fetchLotes();
    fetchEventos();
    fetchCategorias();
  }, []);

  const fetchLotes = async () => {
    const res = await axios.get('http://localhost:3333/lotes');
    setLotes(res.data);
  };

  const fetchEventos = async () => {
    const res = await axios.get('http://localhost:3333/eventos');
    setEventos(res.data);
  };

  const fetchCategorias = async () => {
    const res = await axios.get('http://localhost:3333/categorias');
    setCategorias(res.data);
  };

  const handleOpen = async (lote: any | null = null) => {
    if (lote) {
      const res = await axios.get(`http://localhost:3333/lotes/${lote.id}`);
      const dados = res.data;
      setEditando(dados);
      setFormData({
        nome: dados.nome, descricao: dados.descricao,
        lance_minimo: dados.lance_minimo.toString(),
        data_inicio: dados.data_inicio.slice(0, 16),
        data_fim: dados.data_fim.slice(0, 16),
        evento_id: dados.evento_id.toString(),
        categoria_id: dados.categoria_id.toString()
      });
      setImagensExistentes(dados.imagens || []);
    } else {
      setEditando(null);
      setFormData({ nome: '', descricao: '', lance_minimo: '', data_inicio: '', data_fim: '', evento_id: '', categoria_id: '' });
      setImagensExistentes([]);
    }
    setImagensNovas([]);
    setImagensRemovidas([]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setImagensNovas(Array.from(files));
  };

  const handleRemoveImagemExistente = (url: string) => {
    setImagensRemovidas([...imagensRemovidas, url]);
    setImagensExistentes(imagensExistentes.filter(img => img !== url));
  };

  const handleRemoveImagemNova = (index: number) => {
    const novas = [...imagensNovas];
    novas.splice(index, 1);
    setImagensNovas(novas);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    // Debug de validação de evento
    console.log('formData.evento_id:', formData.evento_id);
    console.log('eventos disponíveis:', eventos);

    // Validação de datas dentro do intervalo do evento
    const selectedEvent = eventos.find(ev => ev.id === parseInt(formData.evento_id, 10));
    if (!selectedEvent) {
      alert('Selecione um evento válido.');
      return;
    }
    const lotStart = new Date(formData.data_inicio);
    const lotEnd = new Date(formData.data_fim);
    const evStart = new Date(selectedEvent.data_inicio);
    const evEnd = new Date(selectedEvent.data_fim);
    if (lotStart < evStart || lotEnd > evEnd) {
      alert(`Datas do lote devem estar entre ${evStart.toLocaleString()} e ${evEnd.toLocaleString()}.`);
      return;
    }
    const lotePayload = {
      nome: formData.nome,
      descricao: formData.descricao,
      lance_minimo: parseFloat(formData.lance_minimo),
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
      evento_id: parseInt(formData.evento_id),
      categoria_id: parseInt(formData.categoria_id),
      imagensRemovidas: imagensRemovidas
    };

    try {
      let loteId: number;
      if (editando) {
        await axios.put(`http://localhost:3333/lotes/${editando.id}`, lotePayload, { headers: { Authorization: `Bearer ${token}` } });
        loteId = editando.id;
      } else {
        const res = await axios.post(`http://localhost:3333/lotes`, lotePayload, { headers: { Authorization: `Bearer ${token}` } });
        loteId = res.data.id;
      }

      if (imagensNovas.length > 0 && loteId) {
        const form = new FormData();
        imagensNovas.forEach(img => form.append('imagens', img));
        await axios.post(`http://localhost:3333/lotes/${loteId}/imagens`, form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchLotes();
      handleClose();
    } catch (error: any) {
      console.error('Erro ao salvar lote:', error);
      alert(error.response?.data?.mensagem || 'Erro ao salvar lote');
    }
  };

  function handleDelete(id: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Administração de Lotes</Typography>
      <Button variant="contained" onClick={() => handleOpen()}>Novo Lote</Button>

      {lotes.map((lote) => (
        <Paper key={lote.id} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">{lote.nome}</Typography>
          <Typography variant="body2">Evento: {lote.evento_nome} | Categoria: {lote.categoria_nome}</Typography>
          <Typography variant="body2">Início: {new Date(lote.data_inicio).toLocaleString()}</Typography>
          <Typography variant="body2">Fim: {new Date(lote.data_fim).toLocaleString()}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {lote.imagens?.map((img: string, i: number) => (
              <img key={i} src={img} width={100} height={60} style={{ borderRadius: 4 }} />
            ))}
          </Box>
          <Box sx={{ mt: 1 }}>
            <IconButton onClick={() => handleOpen(lote)}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(lote.id)}><DeleteIcon /></IconButton>
          </Box>
        </Paper>
      ))}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editando ? 'Editar Lote' : 'Novo Lote'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" name="nome" label="Nome" value={formData.nome} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="descricao" label="Descrição" value={formData.descricao} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="lance_minimo" label="Lance Mínimo" value={formData.lance_minimo} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="data_inicio" type="datetime-local" label="Data Início" value={formData.data_inicio} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="dense" name="data_fim" type="datetime-local" label="Data Fim" value={formData.data_fim} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth select name="evento_id" label="Evento" value={formData.evento_id} onChange={handleChange} margin="dense">
            <MenuItem value="">Selecione...</MenuItem>
            {eventos.map((ev: any) => <MenuItem key={ev.id} value={ev.id}>{ev.nome}</MenuItem>)}
          </TextField>
          <TextField fullWidth select name="categoria_id" label="Categoria" value={formData.categoria_id} onChange={handleChange} margin="dense">
            <MenuItem value="">Selecione...</MenuItem>
            {categorias.map((cat: any) => <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>)}
          </TextField>

          <input type="file" multiple onChange={handleFileChange} style={{ marginTop: 16 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {imagensExistentes.map((url, i) => (
              <Box key={i} sx={{ position: 'relative' }}>
                <img src={url} width={100} height={70} style={{ borderRadius: 4 }} />
                <IconButton onClick={() => handleRemoveImagemExistente(url)} size="small" sx={{ position: 'absolute', top: -8, right: -8, background: 'white' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {imagensNovas.map((file, i) => (
              <Box key={i} sx={{ position: 'relative' }}>
                <img src={URL.createObjectURL(file)} width={100} height={70} style={{ borderRadius: 4 }} />
                <IconButton onClick={() => handleRemoveImagemNova(i)} size="small" sx={{ position: 'absolute', top: -8, right: -8, background: 'white' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLotes;
