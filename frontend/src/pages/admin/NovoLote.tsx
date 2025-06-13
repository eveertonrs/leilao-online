import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';

const NovoLote = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lanceMinimo, setLanceMinimo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [eventoId, setEventoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [comissao, setComissao] = useState('');
  const [imagens, setImagens] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3333/eventos').then(res => setEventos(res.data));
    axios.get('http://localhost:3333/categorias').then(res => setCategorias(res.data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImagens(prev => [...prev, ...fileArray]);
      setPreview(prev => [...prev, ...fileArray.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImagens = imagens.filter((_, i) => i !== index);
    const updatedPreview = preview.filter((_, i) => i !== index);
    setImagens(updatedImagens);
    setPreview(updatedPreview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    const token = localStorage.getItem('token');

    try {
      const lotePayload = {
        nome,
        descricao,
        lance_minimo: parseFloat(lanceMinimo),
        data_inicio: dataInicio,
        data_fim: dataFim,
        evento_id: parseInt(eventoId),
        categoria_id: parseInt(categoriaId),
        comissao: parseFloat(comissao),
      };

      const res = await axios.post('http://localhost:3333/lotes', lotePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imagens.length > 0 && res.data?.id) {
        const form = new FormData();
        imagens.forEach(img => form.append('imagens', img));

        await axios.post(`http://localhost:3333/lotes/${res.data.id}/imagens`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/admin/lotes');
    } catch (error: any) {
      alert(error.response?.data?.mensagem || 'Erro ao criar lote');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center border-b border-gray-600 pb-2">📦 Cadastro de Novo Lote</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1 */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome do Lote"
            className="p-3 bg-gray-700 rounded w-full"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Lance Mínimo"
            className="p-3 bg-gray-700 rounded w-full"
            value={lanceMinimo}
            onChange={(e) => setLanceMinimo(e.target.value)}
            required
          />
        </div>

        {/* Seção 2: Descrição */}
        <div>
          <label className="text-sm mb-1 block">Descrição (HTML)</label>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              placeholder="Insira aqui a descrição com tags HTML ou texto comum"
              className="w-full p-3 bg-gray-700 rounded h-52"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
            <div
              className="prose prose-sm dark:prose-invert bg-gray-900 p-4 rounded overflow-auto"
              dangerouslySetInnerHTML={{ __html: descricao }}
            />
          </div>
        </div>

        {/* Seção 3: Datas */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            className="p-3 bg-gray-700 rounded w-full"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="p-3 bg-gray-700 rounded w-full"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>

        {/* Seção 4: Relacionamentos */}
        <div className="grid md:grid-cols-2 gap-4">
          <select
            className="p-3 bg-gray-700 rounded w-full"
            value={eventoId}
            onChange={(e) => setEventoId(e.target.value)}
            required
          >
            <option value="">Selecione um evento</option>
            {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.nome}</option>)}
          </select>

          <select
            className="p-3 bg-gray-700 rounded w-full"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
          </select>
        </div>

        {/* Seção 5: Comissão */}
        <input
          type="number"
          placeholder="Comissão (%)"
          className="p-3 bg-gray-700 rounded w-full"
          value={comissao}
          onChange={(e) => setComissao(e.target.value)}
          required
        />

        {/* Seção 6: Upload de Imagens */}
        <div>
          <label className="block mb-1 text-sm">Imagens do Lote</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-gray-700 p-2 rounded"
          />
        </div>

        {preview.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {preview.map((src, idx) => (
              <div key={idx} className="relative">
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-28 h-20 object-cover rounded border border-gray-600 shadow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botão final */}
        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded font-semibold text-white transition disabled:opacity-60"
        >
          {carregando ? 'Salvando...' : 'Salvar Lote'}
        </button>
      </form>
    </div>
  );
};

export default NovoLote;
