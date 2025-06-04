import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

type Evento = {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  foto_capa?: string | null;
};

const banners = [
  'https://www.picellileiloes.com.br/arquivos/leiloes/logos/67925f3fca5c9.jpeg',
  'https://www.maxicar.com.br/wp-content/uploads/2024/07/DCM_BANNER_CUPOM_600X500.jpg',
  'https://i.pinimg.com/originals/4a/f3/8c/4af38c93a23b50ccb11a0f06ff4a4870.jpg',
];

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
  const isAdmin = usuarioLogado?.tipo === 'ADMIN';

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos(filtro: 'todos' | 'ativos' | 'futuros' = 'todos') {
    try {
      const response = await axios.get<Evento[]>('http://localhost:3333/eventos');
      let data = response.data;
      const agora = new Date();
      if (filtro === 'ativos') {
        data = data.filter(e => new Date(e.data_inicio) <= agora && new Date(e.data_fim) >= agora);
      } else if (filtro === 'futuros') {
        data = data.filter(e => new Date(e.data_inicio) > agora);
      }
      setEventos(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  }

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3333/eventos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Evento excluído com sucesso!');
      fetchEventos();
    } catch (error) {
      console.error('Erro ao excluir o evento:', error);
      alert('Erro ao excluir o evento');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <Slider autoplay dots infinite speed={700} slidesToShow={1} slidesToScroll={1} className="rounded-xl overflow-hidden mb-8 shadow-xl">
          {banners.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt={`Banner ${index + 1}`} className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </Slider>

        <h2 className="text-4xl font-bold text-center text-blue-300 border-b-4 border-blue-600 inline-block pb-2 mb-8">Leilões em Destaque</h2>

        <div className="flex justify-center gap-4 mb-10">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full" onClick={() => fetchEventos('todos')}>Todos</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full" onClick={() => fetchEventos('ativos')}>Ativos</button>
          <button className="bg-yellow-400 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-full" onClick={() => fetchEventos('futuros')}>Futuros</button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
              <img
                src={evento.foto_capa ? `http://localhost:3333/uploads/${evento.foto_capa}` : 'https://source.unsplash.com/400x200/?auction,event'}
                alt={evento.nome}
                className="h-48 w-full object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{evento.nome}</h3>
                <p className="text-sm text-gray-300">{evento.descricao || 'Sem descrição'}</p>
                <p className="text-sm text-blue-400 mt-2">Início: {new Date(evento.data_inicio).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between items-center px-4 pb-4">
                <Link
                  to={`/eventos/${evento.id}`}
                  className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded"
                >
                  Detalhes
                </Link>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/editar-evento/${evento.id}`)} className="bg-yellow-500 hover:bg-yellow-700 text-black px-2 py-1 rounded flex items-center">
                      <PencilSquareIcon className="h-5 w-5 mr-1" />
                      Editar
                    </button>
                    <button onClick={() => handleExcluir(evento.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center">
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
