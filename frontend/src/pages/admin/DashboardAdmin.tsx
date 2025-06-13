import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Layers, Users } from 'lucide-react';
import AdminDashboardCharts from '../../components/AdminDashboardCharts';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const cards = [
    {
      titulo: 'TOTAL DE EVENTOS',
      valor: 10,
      cor: 'bg-blue-600',
      icone: <CalendarDays size={28} />,
      rota: '/admin/eventos'
    },
    {
      titulo: 'TOTAL DE LOTES',
      valor: 50,
      cor: 'bg-green-600',
      icone: <Layers size={28} />,
      rota: '/admin/lotes'
    },
    {
      titulo: 'TOTAL DE USUÁRIOS',
      valor: 100,
      cor: 'bg-yellow-600',
      icone: <Users size={28} />,
      rota: '/admin/usuarios' // ajuste conforme necessário
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-300 mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.rota)}
            className={`cursor-pointer ${card.cor} hover:brightness-110 text-white rounded-xl p-6 shadow-lg flex justify-between items-center transition`}
          >
            <div>
              <p className="text-sm uppercase text-gray-200">{card.titulo}</p>
              <p className="text-3xl font-bold">{card.valor}</p>
            </div>
            <div className="opacity-50">
              {card.icone}
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos do Dashboard */}
      <AdminDashboardCharts />
    </div>
  );
};

export default DashboardAdmin;
