import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Lote {
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
  imagens?: string[];
}

const AdminLotes = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [filtroEvento, setFiltroEvento] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroMinLance, setFiltroMinLance] = useState('');
  const [filtroMaxLance, setFiltroMaxLance] = useState('');
  const [eventos, setEventos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLotes();
    fetchEventos();
    fetchCategorias();
  }, []);

  const fetchLotes = async () => {
    try {
      const res = await axios.get('http://localhost:3333/lotes');
      setLotes(res.data);
    } catch (err) {
      console.error('Erro ao buscar lotes:', err);
    }
  };

  const fetchEventos = async () => {
    const res = await axios.get('http://localhost:3333/eventos');
    setEventos(res.data);
  };

  const fetchCategorias = async () => {
    const res = await axios.get('http://localhost:3333/categorias');
    setCategorias(res.data);
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Administração de Lotes</h2>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          onClick={() => navigate('/admin/novo-lote')}
        >
          Novo Lote
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
          value={filtroEvento}
          onChange={(e) => setFiltroEvento(e.target.value)}
        >
          <option value="">Filtrar por evento</option>
          {eventos.map(ev => (
            <option key={ev.id} value={ev.nome}>{ev.nome}</option>
          ))}
        </select>

        <select
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Filtrar por categoria</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.nome}>{cat.nome}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Lance mínimo (de)"
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
          value={filtroMinLance}
          onChange={(e) => setFiltroMinLance(e.target.value)}
        />

        <input
          type="number"
          placeholder="Lance mínimo (até)"
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
          value={filtroMaxLance}
          onChange={(e) => setFiltroMaxLance(e.target.value)}
        />
      </div>

      {/* Lista de Lotes */}
      <div className="space-y-4">
        {lotesFiltrados.map((lote) => (
          <div
            key={lote.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex items-start justify-between"
          >
            <div className="flex items-start space-x-4">
              {lote.imagens?.[0] ? (
                <img
                  src={lote.imagens[0]}
                  alt="Imagem do lote"
                  className="h-20 w-20 rounded object-cover"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-600 text-gray-300 flex items-center justify-center rounded">
                  Sem imagem
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-white">{lote.nome}</p>
                <p className="text-sm text-gray-300">{lote.descricao}</p>
                <p className="text-sm text-gray-400">Evento: {lote.evento_nome} | Categoria: {lote.categoria_nome}</p>
                <p className="text-sm text-gray-400">Início: {new Date(lote.data_inicio).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Fim: {new Date(lote.data_fim).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Lance mínimo: R$ {lote.lance_minimo}</p>
                <p className="text-sm text-gray-400">Status: {lote.status}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/admin/editar-lote/${lote.id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
              >
                <PencilSquareIcon className="h-4 w-4 inline-block mr-1" /> Editar
              </button>
              <button
                onClick={() => handleDelete(lote.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
              >
                <TrashIcon className="h-4 w-4 inline-block mr-1" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLotes;
