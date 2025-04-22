import { useState } from 'react';
import axios from 'axios';

const NovoEvento = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [fotoCapa, setFotoCapa] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim);
    if (fotoCapa) {
      formData.append('foto_capa', fotoCapa);
    }

    try {
      await axios.post('http://localhost:3333/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Evento criado com sucesso!');
      // limpar formulário
      setNome('');
      setDescricao('');
      setDataInicio('');
      setDataFim('');
      setFotoCapa(null);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Novo Evento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label><br />
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div>
          <label>Descrição:</label><br />
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>

        <div>
          <label>Data Início:</label><br />
          <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        </div>

        <div>
          <label>Data Fim:</label><br />
          <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
        </div>

        <div>
          <label>Imagem de Capa:</label><br />
          <input type="file" accept="image/*" onChange={(e) => setFotoCapa(e.target.files?.[0] ?? null)} />
        </div>

        <button type="submit" style={{ marginTop: 10 }}>Salvar</button>
      </form>
    </div>
  );
};

export default NovoEvento;
