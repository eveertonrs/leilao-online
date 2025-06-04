import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { AuthContext } from '../contexts/AuthContext';

const DetalhesLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [lote, setLote] = useState<any>(null);
  const [lances, setLances] = useState<any[]>([]);
  const [maiorLance, setMaiorLance] = useState<number>(0);
  const [novoLance, setNovoLance] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:3333/lotes/${id}`).then(res => setLote(res.data));
    axios.get(`http://localhost:3333/lances/lote/${id}`).then(res => setLances(res.data));
    axios.get(`http://localhost:3333/lances/maior-lance/${id}`).then(res => setMaiorLance(res.data?.valor || 0));
  }, [id]);

  const enviarLance = () => {
    setErro(null);
    setSucesso(null);

    if (!usuario) return setErro('Você precisa estar logado para dar um lance.');
    const valor = parseFloat(novoLance);
    if (isNaN(valor)) return setErro('Digite um valor válido.');
    if (valor < lote.lance_minimo) return setErro(`O lance deve ser maior ou igual a R$ ${lote.lance_minimo}.`);
    if (valor <= maiorLance) return setErro(`O lance deve ser maior que o lance atual de R$ ${maiorLance}.`);

    const confirmar = window.confirm(`Tem certeza que deseja dar o lance de R$ ${valor.toFixed(2)}?`);
    if (!confirmar) return;

    axios.post('http://localhost:3333/lances/lance', {
      valor,
      usuario_id: usuario.id,
      lote_id: id
    })
    .then(() => {
      setNovoLance('');
      setSucesso('Lance enviado com sucesso!');
      return Promise.all([
        axios.get(`http://localhost:3333/lances/lote/${id}`),
        axios.get(`http://localhost:3333/lances/maior-lance/${id}`)
      ]);
    })
    .then(([resLances, resMaior]) => {
      setLances(resLances.data);
      setMaiorLance(resMaior.data?.valor || 0);
    })
    .catch(() => setErro('Erro ao enviar o lance.'));
  };

  if (!lote) return <div className="text-center mt-4">Carregando...</div>;

  const imagens = lote.imagens?.map((url: string) => ({ original: url, thumbnail: url })) || [];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl p-4 bg-gray-100">
        <button onClick={() => navigate(-1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3">Voltar</button>
        <h2 className="text-2xl font-bold text-center mt-4 border-b-2 border-blue-500 inline-block pb-1">
          {lote.nome}
        </h2>

        <div className="text-center mb-3">
          <img
            src={`http://localhost:3333${lote.imagens[0]}`}
            alt={lote.nome}
            className="max-w-full rounded-xl shadow-md"
          />
        </div>

        <p className="text-gray-700 mb-2 text-lg">
          {lote.descricao}
        </p>

        <div className="flex justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="text-gray-600">Início:</div>
            <div>{new Date(lote.data_inicio).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600">Fim:</div>
            <div>{new Date(lote.data_fim).toLocaleString()}</div>
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          📢 Lances
        </h3>
        <div className="text-gray-700 mb-2"><strong>Maior lance atual:</strong> R$ {maiorLance}</div>
        {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2" role="alert">
          <span className="block sm:inline">{erro}</span>
        </div>}
        {sucesso && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-2" role="alert">
          <span className="block sm:inline">{sucesso}</span>
        </div>}

        <ul className="max-h-72 overflow-auto mb-2">
          {lances.map((lance, index) => (
            <li
              key={index}
              className={`py-2 ${lance.valor === maiorLance ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              <div className="flex justify-between">
                <div>
                  {lance.valor === maiorLance && <span>🏆</span>}
                  R$ {lance.valor}
                </div>
                <div className="text-gray-500">
                  Usuário: {lance.usuario} - {new Date(lance.data_lance).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {usuario ? (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Seu lance"
              value={novoLance}
              onChange={e => setNovoLance(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button onClick={enviarLance} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Enviar</button>
          </div>
        ) : (
          <div className="text-gray-600">Faça login para dar um lance.</div>
        )}
      </div>
    </div>
  );
};

export default DetalhesLote;
