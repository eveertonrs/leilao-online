import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  foto_capa: string;
}

const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:3333/eventos');
        setEventos(response.data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };

    fetchEventos();
  }, []);

  return (
    <div className="p-4 font-sans">
      <h4 className="text-2xl font-bold text-text-primary mb-2">
        Listagem de Eventos
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {eventos.map((evento: Evento) => (
          <div key={evento.id} className="h-full flex flex-col transition-transform hover:scale-105 shadow-card rounded-md overflow-hidden">
            <img
              className="h-40 object-cover w-full"
              src={`http://localhost:3333/uploads/${evento.foto_capa}`}
              alt={evento.nome}
            />
            <div className="flex-grow p-4">
              <h6 className="text-lg font-semibold text-text-primary mb-1">
                {evento.nome}
              </h6>
              <p className="text-sm text-text-secondary">
                {evento.descricao}
              </p>
              <p className="text-sm text-text-secondary">
                Início: {new Date(evento.data_inicio).toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary">
                Fim: {new Date(evento.data_fim).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventos;
