import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Home: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar mensagem', error);
      });
  }, []);

  return (
    <div>
      <h1>Bem-vindo à API de Leilão!</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;
