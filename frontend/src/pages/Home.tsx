import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const banners = [
  'https://www.picellileiloes.com.br/arquivos/leiloes/logos/67925f3fca5c9.jpeg',
  'https://www.maxicar.com.br/wp-content/uploads/2024/07/DCM_BANNER_CUPOM_600X500.jpg',
  'https://i.pinimg.com/originals/4a/f3/8c/4af38c93a23b50ccb11a0f06ff4a4870.jpg',
];

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  foto_capa?: string | null;
}

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

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    infinite: true,
    fade: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-10">
      <div className="container mx-auto px-4">
        <Slider {...sliderSettings} className="rounded-xl overflow-hidden mb-8 shadow-2xl">
          {banners.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt={`Banner ${index + 1}`} className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold shadow-lg">
                  Participe dos maiores leilões do Brasil!
                </h2>
              </div>
            </div>
          ))}
        </Slider>

        <div className="flex justify-center mt-8 mb-12">
          <div className="flex w-full max-w-2xl shadow-lg rounded-full bg-white overflow-hidden">
            <input
              type="text"
              placeholder="Buscar por leilão, cidade ou leiloeiro..."
              className="flex-1 px-6 py-3 text-gray-800 placeholder-gray-500 outline-none"
              disabled
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z" />
              </svg>
            </button>
          </div>
        </div>

        <section className="my-16">
          <h3 className="text-3xl font-bold text-center text-white mb-10">Por que comprar no Meu Leilão?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            <div>
              <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Segurança" className="mx-auto w-14 mb-2" />
              <p className="font-semibold">Segurança</p>
              <p className="text-sm text-gray-400">Ambiente confiável e protegido</p>
            </div>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" alt="Economia" className="mx-auto w-14 mb-2" />
              <p className="font-semibold">Economia</p>
              <p className="text-sm text-gray-400">Preços abaixo do mercado</p>
            </div>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/512/1029/1029183.png" alt="Variedade" className="mx-auto w-14 mb-2" />
              <p className="font-semibold">Variedade</p>
              <p className="text-sm text-gray-400">Diversos tipos de bens</p>
            </div>
            <div>
              <img src="https://cdn-icons-png.flaticon.com/512/711/711769.png" alt="Transparência" className="mx-auto w-14 mb-2" />
              <p className="font-semibold">Transparência</p>
              <p className="text-sm text-gray-400">Informações claras e atualizadas</p>
            </div>
          </div>
        </section>

        <h2 className="text-4xl font-bold text-center text-blue-300 border-b-4 border-blue-600 inline-block pb-2 mb-8">Leilões em Destaque</h2>

        <div className="flex justify-center gap-4 mb-10">
          <button className="transition transform hover:scale-105 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full" onClick={() => fetchEventos('todos')}>Todos</button>
          <button className="transition transform hover:scale-105 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full" onClick={() => fetchEventos('ativos')}>Ativos</button>
          <button className="transition transform hover:scale-105 bg-yellow-400 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-full" onClick={() => fetchEventos('futuros')}>Futuros</button>
        </div>

        {eventos.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">Nenhum leilão encontrado no momento.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eventos.map((evento) => (
              <div key={evento.id} className="bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <img
                  src={evento.foto_capa ? `http://localhost:3333/uploads/${evento.foto_capa}` : 'https://source.unsplash.com/400x200/?auction,event'}
                  alt={`Imagem do evento ${evento.nome}`}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{evento.nome}</h3>
                  <p className="text-sm text-gray-300">{evento.descricao || 'Sem descrição'}</p>
                  <p className="text-sm text-blue-400 mt-2">Início: {new Date(evento.data_inicio).toLocaleDateString()}</p>
                  <p className="text-sm text-red-300">Fim: {new Date(evento.data_fim).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between items-center px-4 pb-4">
                  <Link to={`/eventos/${evento.id}`} className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded">Detalhes</Link>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/editar-evento/${evento.id}`)} className="bg-yellow-500 hover:bg-yellow-700 text-black px-2 py-1 rounded flex items-center">
                        <PencilSquareIcon className="h-5 w-5 mr-1" /> Editar
                      </button>
                      <button onClick={() => handleExcluir(evento.id)} className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center">
                        <TrashIcon className="h-5 w-5 mr-1" /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/eventos" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-blue-100 transition">
            Ver todos os leilões
          </Link>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 pt-10 pb-5 mt-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Contato</h4>
            <p>Email: contato@meuleilao.com</p>
            <p>Telefone: (11) 91234-5678</p>
            <p>Endereço: Rua Exemplo, 123 – São Paulo/SP</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Institucional</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white">Quem Somos</a></li>
              <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-white text-lg font-semibold mb-3">Segurança</h4>
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
              alt="Selo de Segurança SSL"
              className="w-16 mb-2 mx-auto"
            />
            <p className="text-xs text-center text-gray-400">Conexão segura com certificado SSL</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Localização</h4>
            <div className="rounded overflow-hidden shadow-md">
              <iframe
                title="Mapa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.590292679403!2d-46.63947468445685!3d-23.58306888466812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59cba987c03f%3A0x57c60b2f771c9dd7!2sPra%C3%A7a%20da%20S%C3%A9!5e0!3m2!1spt-BR!2sbr!4v1718131430646!5m2!1spt-BR!2sbr"
                width="100%"
                height="150"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-10">
          &copy; {new Date().getFullYear()} Meu Leilão. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
