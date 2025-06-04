import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

type Evento = {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  foto_capa?: string | null;
};

const AdminEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtroNome, setFiltroNome] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get<Evento[]>('http://localhost:3333/eventos');
      setEventos(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3333/eventos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Evento excluído com sucesso');
        fetchEventos();
      } catch (error: any) {
        console.error('Erro ao excluir evento:', error);
        const mensagem = error.response?.data?.mensagem || 'Erro ao excluir evento';
        alert(mensagem);
      }
    }
  };

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">Administração de Eventos</h2>

      {/* Filtro e botão */}
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFiltroNome(e.target.value)}
          className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => navigate('/admin/novo-evento')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          Novo Evento
        </button>
      </div>

      {/* Lista de eventos */}
      <div className="space-y-6">
        {eventosFiltrados.map((evento) => (
          <div
            key={evento.id}
            className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              {evento.foto_capa ? (
                <img
                  src={`http://localhost:3333/uploads/${evento.foto_capa}`}
                  alt={evento.nome}
                  className="h-24 w-36 rounded-lg object-cover"
                />
              ) : (
                <div className="h-24 w-36 rounded-lg bg-gray-600 flex items-center justify-center text-gray-300 text-sm">
                  Sem Imagem
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">{evento.nome}</h3>
                <p className="text-sm text-gray-400 mb-2">{evento.descricao}</p>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                    Início: {new Date(evento.data_inicio).toLocaleString()}
                  </span>
                  <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full">
                    Fim: {new Date(evento.data_fim).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/admin/editar-evento/${evento.id}`)}
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm transition transform hover:scale-105"
              >
                <PencilSquareIcon className="h-4 w-4 mr-1" />
                Editar
              </button>
              <button
                onClick={() => handleExcluir(evento.id)}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition transform hover:scale-105"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventos;
