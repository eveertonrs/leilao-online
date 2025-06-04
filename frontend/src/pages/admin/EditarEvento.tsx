import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    carregarEvento();
  }, [id]);

  const carregarEvento = async () => {
    try {
      const res = await axios.get(`http://localhost:3333/eventos/${id}`);
      const evento = res.data;
      setNome(evento.nome);
      setDescricao(evento.descricao);
      setDataInicio(evento.data_inicio.slice(0, 16)); // datetime-local exige formato específico
      setDataFim(evento.data_fim.slice(0, 16));
      if (evento.foto_capa) {
        setPreview(`http://localhost:3333/uploads/${evento.foto_capa}`);
      }
    } catch (err) {
      console.error('Erro ao carregar evento:', err);
      alert('Erro ao carregar evento');
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim);
    if (imagem) {
      formData.append('foto_capa', imagem);
    }

    try {
      await axios.put(`http://localhost:3333/eventos/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Evento atualizado com sucesso!');
      navigate('/admin/eventos');
    } catch (error: any) {
      console.error('Erro ao atualizar evento:', error);
      const msg = error.response?.data?.mensagem || 'Erro ao atualizar evento';
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-400 hover:underline"
        >
          ← Voltar
        </button>

        <h2 className="text-2xl font-bold mb-6">Editar Evento</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Data Início</label>
            <input
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Data Fim</label>
            <input
              type="datetime-local"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Imagem de Capa</label>
            <input
              type="file"
              onChange={handleImagemChange}
              className="block w-full text-sm text-gray-300 file:bg-yellow-500 file:text-white file:border-0 file:rounded-md file:py-2 file:px-4"
            />
          </div>

          {preview && (
            <div className="mt-4 text-center">
              <p className="text-sm mb-2">Pré-visualização:</p>
              <img src={preview} alt="Preview" className="mx-auto rounded-md max-h-52" />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md mt-6 transition"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarEvento;
