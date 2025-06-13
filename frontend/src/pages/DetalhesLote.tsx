import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { AuthContext } from '../contexts/AuthContext';
import { CalendarDays, Clock, Gavel, Trophy, FileText, FileCheck2 } from "lucide-react";

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
  const [aba, setAba] = useState<'descricao' | 'documentos' | 'lances'>('descricao');

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

  if (!lote) return <div className="text-center mt-4 text-white">Carregando...</div>;

  const imagens = lote.imagens?.map((url: string) => ({
    original: url,
    thumbnail: url
  })) || [];

  return (
    <div className="flex justify-center p-4 bg-zinc-900 min-h-screen text-black">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Voltar
        </button>

        <div className="rounded-lg overflow-hidden">
          <ImageGallery
            items={imagens}
            showFullscreenButton={true}
            showPlayButton={false}
            showNav={true}
            thumbnailPosition="bottom"
            additionalClass="rounded-md"
          />
        </div>

        {/* Abas */}
        <div className="border-b mt-4 flex space-x-6 justify-center text-gray-600 font-medium">
          <button className={`pb-2 ${aba === 'descricao' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`} onClick={() => setAba('descricao')}>
            <FileText className="inline-block mr-1" size={18}/> Descrição
          </button>
          <button className={`pb-2 ${aba === 'documentos' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`} onClick={() => setAba('documentos')}>
            <FileCheck2 className="inline-block mr-1" size={18}/> Documentos
          </button>
          <button className={`pb-2 ${aba === 'lances' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`} onClick={() => setAba('lances')}>
            <Gavel className="inline-block mr-1" size={18}/> Lances
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="mt-4">
          {aba === 'descricao' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800">{lote.nome}</h2>
              <p className="text-gray-600 mb-3">{lote.descricao}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span><CalendarDays size={16} className="inline mr-1"/> <strong>Início:</strong> {new Date(lote.data_inicio).toLocaleString()}</span>
                <span><Clock size={16} className="inline mr-1"/> <strong>Fim:</strong> {new Date(lote.data_fim).toLocaleString()}</span>
              </div>
            </div>
          )}

          {aba === 'documentos' && (
            <div className="text-gray-700">
              {lote.documentos?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {lote.documentos.map((doc: any, idx: number) => (
                    <li key={idx}>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{doc.nome}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum documento disponível.</p>
              )}
            </div>
          )}

          {aba === 'lances' && (
            <div>
              <div className="text-gray-700 text-base font-semibold mb-2">
                <Gavel size={18} className="inline mr-1"/> Maior lance atual: <span className="text-blue-600">R$ {maiorLance}</span>
              </div>
              <ul className="max-h-48 overflow-y-auto text-sm text-gray-600 mb-2">
                {lances.length === 0 ? (
                  <li className="italic">Nenhum lance ainda</li>
                ) : (
                  lances.map((lance, i) => (
                    <li key={i} className={`py-1 ${lance.valor === maiorLance ? 'text-blue-700 font-bold' : ''}`}>
                      R$ {lance.valor.toFixed(2)} - {lance.usuario} ({new Date(lance.data_lance).toLocaleString()})
                    </li>
                  ))
                )}
              </ul>

              {erro && <div className="text-red-600 text-sm mb-2">{erro}</div>}
              {sucesso && <div className="text-green-600 text-sm mb-2">{sucesso}</div>}

              {usuario && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Digite seu lance"
                    value={novoLance}
                    onChange={e => setNovoLance(e.target.value)}
                    className="flex-grow border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    onClick={enviarLance}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded"
                  >Confirmar</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesLote;
