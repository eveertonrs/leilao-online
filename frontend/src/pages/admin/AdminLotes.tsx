import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

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
      await axios.delete(`http://localhost:3333/lotes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLotes();
    }
  };

  const getStatus = (inicio: string, fim: string): string => {
    const now = new Date();
    const start = new Date(inicio);
    const end = new Date(fim);
    if (now < start) return 'Em breve';
    if (now >= start && now <= end) return 'Ativo';
    return 'Encerrado';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-600';
      case 'Em breve':
        return 'bg-yellow-600';
      case 'Encerrado':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Administração de Lotes</h2>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          onClick={() => navigate('/admin/novo-lote')}
        >
          Novo Lote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <select
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
          value={filtroEvento}
          onChange={(e) => setFiltroEvento(e.target.value)}
        >
          <option value="">Filtrar por evento</option>
          {eventos.map(ev => <option key={ev.id} value={ev.nome}>{ev.nome}</option>)}
        </select>
        <select
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Filtrar por categoria</option>
          {categorias.map(cat => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
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

      {/* Grid de Lotes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {lotesFiltrados.map((lote) => {
          const status = getStatus(lote.data_inicio, lote.data_fim);
          return (
            <div
              key={lote.id}
              className="bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={lote.imagens?.[0] || ''}
                alt={lote.nome}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-white">{lote.nome}</h3>
                  <p className="text-sm text-gray-400">{lote.descricao}</p>
                  <p className="text-sm text-gray-500">Evento: {lote.evento_nome}</p>
                  <p className="text-sm text-gray-500">Categoria: {lote.categoria_nome}</p>
                  <p className="text-sm text-gray-500">Início: {new Date(lote.data_inicio).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Fim: {new Date(lote.data_fim).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Lance mínimo: R$ {lote.lance_minimo}</p>
                  <span className={`inline-block text-xs px-3 py-1 mt-2 rounded-full text-white ${getStatusClass(status)}`}>
                    {status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/lote/${lote.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    <EyeIcon className="h-4 w-4 inline-block mr-1" /> Ver detalhes
                  </button>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminLotes;
