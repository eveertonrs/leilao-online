import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

const DetalhesEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState<any>(null);
  const [lotes, setLotes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3333/eventos/${id}`)
        .then(response => setEvento(response.data))
        .catch(error => console.error('Erro ao carregar evento:', error));

      axios.get(`http://localhost:3333/lotes/evento/${id}`)
        .then(response => setLotes(response.data))
        .catch(error => console.error('Erro ao carregar lotes:', error));
    }
  }, [id]);

  if (!evento) return <div className="text-center mt-4">Carregando...</div>;

  return (
    <div className="flex justify-center p-4 bg-gray-900 min-h-screen text-gray-800">
      <div className="w-full max-w-5xl bg-gray-100 rounded-lg shadow-lg overflow-hidden">

        {/* IMAGEM DE CAPA */}
        <div className="relative">
          <img
            src={`http://localhost:3333/uploads/${evento.foto_capa}`}
            alt={evento.nome}
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">{evento.nome}</h1>
          </div>
        </div>

        {/* DESCRIÇÃO E DATAS */}
        <div className="p-6">
          <p className="text-lg text-gray-700 mb-4">{evento.descricao}</p>
          <div className="flex justify-between flex-wrap gap-4 border-y py-4 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
              Início: <span className="text-black">{new Date(evento.data_inicio).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-red-500" />
              Fim: <span className="text-black">{new Date(evento.data_fim).toLocaleString()}</span>
            </div>
          </div>

          {/* Lotes */}
          <h2 className="text-2xl font-semibold mt-6 mb-4 flex items-center gap-2">
            🔨 Lotes Disponíveis
          </h2>

          {lotes.length === 0 ? (
            <div className="text-gray-600">Nenhum lote cadastrado para este evento.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {lotes.map((lote) => (
                <div key={lote.id} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">
                  {lote.imagens?.length > 0 && (
                    <img
                      src={`http://localhost:3333${lote.imagens[0]}`}
                      alt={lote.nome}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{lote.nome}</h3>
                    <p className="text-sm text-gray-600 mb-1">{lote.descricao}</p>
                    <p className="text-blue-600 font-semibold">Lance mínimo: R$ {lote.lance_minimo}</p>
                    <p className="text-sm text-gray-500">Início: {new Date(lote.data_inicio).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Fim: {new Date(lote.data_fim).toLocaleString()}</p>
                    <button
                      onClick={() => navigate(`/lotes/${lote.id}`)}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded font-medium transition"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rodapé / Participar */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-2">
              Participe do leilão e aproveite oportunidades exclusivas!
            </p>
            <button
              onClick={() => alert('Funcionalidade futura: participação no leilão')}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-full transition"
            >
              🎯 Participe do Leilão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesEvento;
