// src/pages/NovoEvento.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NovoEvento = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [videoAoVivo, setVideoAoVivo] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagem(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!imagem) return alert('Selecione uma imagem!');

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim);
    formData.append('link_video', videoAoVivo);
    formData.append('foto_capa', imagem);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3333/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Evento criado com sucesso!');
      navigate('/admin/eventos');
    } catch (error: any) {
      const mensagem = error.response?.data?.mensagem || 'Erro ao criar evento';
      alert(`Erro ao criar evento: ${mensagem}`);
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

        <h2 className="text-2xl font-bold mb-6">Novo Evento</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Link do Vídeo Ao Vivo (iframe embed ou YouTube)</label>
            <input
              type="text"
              placeholder='Ex: https://www.youtube.com/embed/xxxxxxxxx'
              value={videoAoVivo}
              onChange={(e) => setVideoAoVivo(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Data Início</label>
              <input
                type="datetime-local"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Data Fim</label>
              <input
                type="datetime-local"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Imagem de Capa</label>
            <input
              type="file"
              onChange={handleImagemChange}
              className="block w-full text-sm text-gray-300 file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:py-2 file:px-4"
            />
          </div>

          {preview && (
            <div className="mt-4 text-center">
              <p className="text-sm mb-2">Pré-visualização:</p>
              <img src={preview} alt="Pré-visualização" className="mx-auto rounded-md max-h-52" />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-6 transition"
          >
            Salvar Evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default NovoEvento;
