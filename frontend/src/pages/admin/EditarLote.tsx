import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarLote = () => {
  const { id } = useParams();
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
  const [imagensExistentes, setImagensExistentes] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3333/eventos').then(res => setEventos(res.data));
    axios.get('http://localhost:3333/categorias').then(res => setCategorias(res.data));
    axios.get(`http://localhost:3333/lotes/${id}`).then(res => {
      const lote = res.data;
      setNome(lote.nome);
      setDescricao(lote.descricao);
      setLanceMinimo(lote.lance_minimo);
      setDataInicio(lote.data_inicio.slice(0, 16));
      setDataFim(lote.data_fim.slice(0, 16));
      setEventoId(lote.evento_id);
      setCategoriaId(lote.categoria_id);
      setComissao(lote.comissao);
      setImagensExistentes(lote.imagens || []);
    });
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImagens(fileArray);
      setPreview(fileArray.map(file => URL.createObjectURL(file)));
    }
  };

  const removerImagemExistente = (imagemId: number) => {
    setImagensExistentes(prev => prev.filter(img => img.id !== imagemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        imagens_removidas: imagensExistentes.map(img => img.id)
      };

      await axios.put(`http://localhost:3333/lotes/${id}`, lotePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imagens.length > 0) {
        const form = new FormData();
        imagens.forEach(img => form.append('imagens', img));

        await axios.post(`http://localhost:3333/lotes/${id}/imagens`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/admin/lotes');
    } catch (error: any) {
      alert(error.response?.data?.mensagem || 'Erro ao editar lote');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-b border-gray-600 pb-1">✏️ Editar Lote</h2>
        <button
          onClick={() => navigate('/admin/lotes')}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          ⬅ Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block">Descrição (HTML)</label>
            <textarea
              placeholder="Insira aqui a descrição com tags HTML ou texto comum"
              className="w-full p-3 bg-gray-700 rounded resize-y"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={5}
              required
            />
          </div>
          <div>
            <label className="text-sm mb-1 block">Preview</label>
            <div
              className="w-full h-full p-3 bg-gray-900 rounded text-sm overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: descricao }}
            />
          </div>
        </div>

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

        <input
          type="number"
          placeholder="Comissão (%)"
          className="p-3 bg-gray-700 rounded w-full"
          value={comissao}
          onChange={(e) => setComissao(e.target.value)}
          required
        />

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

        {(imagensExistentes.length > 0 || preview.length > 0) && (
          <div className="flex flex-wrap gap-3 mt-4">
            {imagensExistentes.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={`http://localhost:3333/uploads/${img.url}`}
                  alt="Imagem"
                  className="w-28 h-20 object-cover rounded border border-gray-600 shadow"
                />
                <button
                  type="button"
                  onClick={() => removerImagemExistente(img.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                >
                  X
                </button>
              </div>
            ))}
            {preview.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Preview ${idx}`}
                className="w-28 h-20 object-cover rounded border border-gray-600 shadow"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-semibold text-white transition"
        >
          Atualizar Lote
        </button>
      </form>
    </div>
  );
};

export default EditarLote;
