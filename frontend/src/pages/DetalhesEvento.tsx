import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="flex justify-center">
      <div className="w-full max-w-3xl p-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mt-4 border-b-2 border-blue-500 inline-block pb-1">
          {evento.nome}
        </h2>

        <div className="text-center mb-3">
          <img
            src={`http://localhost:3333/uploads/${evento.foto_capa}`}
            alt={evento.nome}
            className="max-w-full rounded-xl shadow-md"
          />
        </div>

        <p className="text-gray-700 mb-2 text-lg">
          {evento.descricao}
        </p>

        <div className="flex justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="text-gray-600">Início:</div>
            <div>{new Date(evento.data_inicio).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600">Fim:</div>
            <div>{new Date(evento.data_fim).toLocaleString()}</div>
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          🔨 Lotes Disponíveis
        </h3>

        {lotes.length === 0 ? (
          <div className="text-gray-600">Nenhum lote cadastrado para este evento.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {lotes.map((lote) => (
              <div key={lote.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
                  {lote.imagens?.length > 0 && (
                    <img
                      src={`http://localhost:3333${lote.imagens[0]}`}
                      alt={lote.nome}
                      className="w-full h-40 object-cover rounded-t-md"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800">{lote.nome}</h4>
                    <p className="text-gray-600">{lote.descricao}</p>
                    <p className="text-gray-700">Lance mínimo: R$ {lote.lance_minimo}</p>
                    <p className="text-gray-500">Início: {new Date(lote.data_inicio).toLocaleString()}</p>
                    <p className="text-gray-500">Fim: {new Date(lote.data_fim).toLocaleString()}</p>
                    <button onClick={() => navigate(`/lotes/${lote.id}`)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="my-4" />

        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Participe do leilão e aproveite oportunidades exclusivas!
          </p>
          <button
            onClick={() => alert('Funcionalidade futura: participação no leilão')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Participe do Leilão
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesEvento;
