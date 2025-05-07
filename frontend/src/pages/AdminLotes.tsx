import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Box, Button, Typography, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Lote = {
  id: number;
  nome: string;
  descricao: string;
  lance_minimo: number;
  data_inicio: string;
  data_fim: string;
  evento_id: number;
  evento_nome?: string;
  categoria_id: number;
  categoria_nome?: string;
  status?: string;
  lance_atual?: number;
  qtd_lances?: number;
  imagens?: string[];
};

const AdminLotes = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Lote | null>(null);
  const [imagens, setImagens] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [filtroEvento, setFiltroEvento] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroMinLance, setFiltroMinLance] = useState('');
  const [filtroMaxLance, setFiltroMaxLance] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    lance_minimo: '',
    data_inicio: '',
    data_fim: '',
    evento_id: '',
    categoria_id: ''
  });

  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchLotes();
    fetchEventos();
    fetchCategorias();
  }, []);

  const fetchLotes = async () => {
    const response = await axios.get('http://localhost:3333/lotes');
    setLotes(response.data);
  };

  const fetchEventos = async () => {
    const response = await axios.get('http://localhost:3333/eventos');
    setEventos(response.data);
  };

  const fetchCategorias = async () => {
    const response = await axios.get('http://localhost:3333/categorias');
    setCategorias(response.data);
  };

  const handleOpen = async (lote: Lote | null = null) => {
    if (lote) {
      const res = await axios.get(`http://localhost:3333/lotes/${lote.id}`);
      const loteComImagens = res.data;

      setEditando(loteComImagens);
      setFormData({
        nome: loteComImagens.nome,
        descricao: loteComImagens.descricao,
        lance_minimo: loteComImagens.lance_minimo.toString(),
        data_inicio: loteComImagens.data_inicio.slice(0, 16),
        data_fim: loteComImagens.data_fim.slice(0, 16),
        evento_id: loteComImagens.evento_id.toString(),
        categoria_id: loteComImagens.categoria_id.toString()
      });

      setPreview(loteComImagens.imagens || []);
    } else {
      setEditando(null);
      setFormData({ nome: '', descricao: '', lance_minimo: '', data_inicio: '', data_fim: '', evento_id: '', categoria_id: '' });
      setPreview([]);
    }
    setImagens([]);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImagens(fileArray);
      setPreview(fileArray.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    const lotePayload = {
      nome: formData.nome,
      descricao: formData.descricao,
      lance_minimo: parseFloat(formData.lance_minimo),
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
      evento_id: parseInt(formData.evento_id),
      categoria_id: parseInt(formData.categoria_id)
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

      if (imagens.length > 0 && loteId) {
        const form = new FormData();
        imagens.forEach(img => form.append('imagens', img));

        await axios.post(`http://localhost:3333/lotes/${loteId}/imagens`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      fetchLotes();
      handleClose();
    } catch (error: any) {
      console.error('Erro ao salvar lote:', error);
      alert(error.response?.data?.mensagem || 'Erro ao salvar lote');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lote?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3333/lotes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchLotes();
    }
  };

  const lotesFiltrados = lotes.filter((lote) => {
    const matchEvento = !filtroEvento || lote.evento_nome === filtroEvento;
    const matchCategoria = !filtroCategoria || lote.categoria_nome === filtroCategoria;
    const matchMin = !filtroMinLance || lote.lance_minimo >= parseFloat(filtroMinLance);
    const matchMax = !filtroMaxLance || lote.lance_minimo <= parseFloat(filtroMaxLance);
    return matchEvento && matchCategoria && matchMin && matchMax;
  });

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Administração de Lotes</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => handleOpen()}>Novo Lote</Button>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <TextField select label="Evento" value={filtroEvento} onChange={(e) => setFiltroEvento(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="">Todos</MenuItem>
          {eventos.map((ev: any) => <MenuItem key={ev.id} value={ev.nome}>{ev.nome}</MenuItem>)}
        </TextField>
        <TextField select label="Categoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((cat: any) => <MenuItem key={cat.id} value={cat.nome}>{cat.nome}</MenuItem>)}
        </TextField>
        <TextField label="Lance mínimo (de)" type="number" value={filtroMinLance} onChange={(e) => setFiltroMinLance(e.target.value)} />
        <TextField label="Lance mínimo (até)" type="number" value={filtroMaxLance} onChange={(e) => setFiltroMaxLance(e.target.value)} />
      </Box>

      {lotesFiltrados.map((lote) => (
        <Paper key={lote.id} sx={{ padding: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{lote.nome}</Typography>
              <Typography variant="body2">Evento: {lote.evento_nome} | Categoria: {lote.categoria_nome}</Typography>
              <Typography variant="body2">Início: {new Date(lote.data_inicio).toLocaleString()} | Fim: {new Date(lote.data_fim).toLocaleString()}</Typography>
              <Typography variant="body2">Lance Mínimo: R$ {lote.lance_minimo}</Typography>
              {lote.status && <Typography variant="body2">Status: {lote.status}</Typography>}
            </Box>
            <Box>
              <IconButton color="secondary" onClick={() => handleOpen(lote)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(lote.id)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
          {lote.imagens && lote.imagens.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {lote.imagens.map((img, i) => (
                <img key={i} src={img} alt={`lote-${lote.id}-img-${i}`} width={100} height={70} style={{ objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </Box>
          )}
        </Paper>
      ))}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editando ? 'Editar Lote' : 'Novo Lote'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nome" fullWidth name="nome" value={formData.nome} onChange={handleChange} />
          <TextField margin="dense" label="Descrição" fullWidth name="descricao" value={formData.descricao} onChange={handleChange} />
          <TextField margin="dense" label="Lance Mínimo" fullWidth name="lance_minimo" value={formData.lance_minimo} onChange={handleChange} />
          <TextField margin="dense" type="datetime-local" label="Data Início" fullWidth name="data_inicio" value={formData.data_inicio} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" type="datetime-local" label="Data Fim" fullWidth name="data_fim" value={formData.data_fim} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField select margin="dense" label="Evento" fullWidth name="evento_id" value={formData.evento_id} onChange={handleChange}>
            <MenuItem value="">Selecione...</MenuItem>
            {eventos.map((e: any) => <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>)}
          </TextField>
          <TextField select margin="dense" label="Categoria" fullWidth name="categoria_id" value={formData.categoria_id} onChange={handleChange}>
            <MenuItem value="">Selecione...</MenuItem>
            {categorias.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
          </TextField>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: 16 }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {preview.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} width={100} height={70} style={{ objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLotes;
