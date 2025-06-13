// src/components/AdminDashboardCharts.tsx
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboardCharts = () => {
  const dadosEventos = {
    labels: ['Evento A', 'Evento B', 'Evento C'],
    datasets: [
      {
        label: 'Lotes por Evento',
        data: [12, 19, 7],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const dadosLances = {
    labels: ['01/06', '02/06', '03/06', '04/06', '05/06'],
    datasets: [
      {
        label: 'Lances por dia',
        data: [3, 7, 12, 5, 9],
        borderColor: '#10b981',
        backgroundColor: '#d1fae5',
        tension: 0.3,
      },
    ],
  };

  const dadosUsuarios = {
    labels: ['Participantes', 'Administradores', 'Convidados'],
    datasets: [
      {
        data: [80, 15, 5],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Lotes por Evento</h3>
        <Bar data={dadosEventos} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Lances por Dia</h3>
        <Line data={dadosLances} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow md:col-span-2 max-w-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Distribuição de Usuários</h3>
        <Pie data={dadosUsuarios} />
      </div>
    </div>
  );
};

export default AdminDashboardCharts;
