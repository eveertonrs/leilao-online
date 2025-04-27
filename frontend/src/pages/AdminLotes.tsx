import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Paper, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem } from '@mui/material';
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
};

const AdminLotes = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Lote | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    lance_minimo: '',
    data_inicio: '',
    data_fim: '',
    evento_id: '',
    categoria_id: '',
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

  const handleOpen = (lote: Lote | null = null) => {
    if (lote) {
      setEditando(lote);
      setFormData({
        nome: lote.nome,
        descricao: lote.descricao,
        lance_minimo: lote.lance_minimo.toString(),
        data_inicio: lote.data_inicio,
        data_fim: lote.data_fim,
        evento_id: lote.evento_id.toString(),
        categoria_id: lote.categoria_id.toString(),
      });
    } else {
      setEditando(null);
      setFormData({
        nome: '',
        descricao: '',
        lance_minimo: '',
        data_inicio: '',
        data_fim: '',
        evento_id: '',
        categoria_id: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (editando) {
      await axios.put(`http://localhost:3333/lotes/${editando.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post(`http://localhost:3333/lotes`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    fetchLotes();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lote?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3333/lotes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLotes();
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Administração de Lotes</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => handleOpen()}>Novo Lote</Button>

      {lotes.map(lote => (
        <Paper key={lote.id} sx={{ padding: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">{lote.nome}</Typography>
            <Typography variant="body2">Evento: {lote.evento_nome} | Categoria: {lote.categoria_nome}</Typography>
            <Typography variant="body2">Início: {new Date(lote.data_inicio).toLocaleString()} | Fim: {new Date(lote.data_fim).toLocaleString()}</Typography>
            <Typography variant="body2">Lance Mínimo: R$ {lote.lance_minimo}</Typography>
          </Box>
          <Box>
            <IconButton color="secondary" onClick={() => handleOpen(lote)}><EditIcon /></IconButton>
            <IconButton color="error" onClick={() => handleDelete(lote.id)}><DeleteIcon /></IconButton>
          </Box>
        </Paper>
      ))}

      {/* Modal de Criação/Edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editando ? 'Editar Lote' : 'Novo Lote'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nome" fullWidth name="nome" value={formData.nome} onChange={handleChange} />
          <TextField margin="dense" label="Descrição" fullWidth name="descricao" value={formData.descricao} onChange={handleChange} />
          <TextField margin="dense" label="Lance Mínimo" fullWidth name="lance_minimo" value={formData.lance_minimo} onChange={handleChange} />
          <TextField margin="dense" type="datetime-local" label="Data Início" fullWidth name="data_inicio" value={formData.data_inicio} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" type="datetime-local" label="Data Fim" fullWidth name="data_fim" value={formData.data_fim} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField select margin="dense" label="Evento" fullWidth name="evento_id" value={formData.evento_id} onChange={handleChange}>
            {eventos.map((e: any) => <MenuItem key={e.id} value={e.id}>{e.nome}</MenuItem>)}
          </TextField>
          <TextField select margin="dense" label="Categoria" fullWidth name="categoria_id" value={formData.categoria_id} onChange={handleChange}>
            {categorias.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
          </TextField>
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
