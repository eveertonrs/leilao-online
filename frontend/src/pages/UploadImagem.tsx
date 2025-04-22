import { useState, useEffect } from 'react';
import axios from 'axios';

type Evento = {
  id: number;
  nome: string;
};

const UploadImagem = () => {
  const [file, setFile] = useState<File | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const response = await axios.get<Evento[]>('http://localhost:3333/eventos');
        setEventos(response.data);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    }

    fetchEventos();
  }, []);

  const handleUpload = async () => {
    if (!file || !eventoSelecionado) {
      alert('Selecione um arquivo e um evento!');
      return;
    }

    const formData = new FormData();
    formData.append('imagem', file);

    try {
      // 1. Envia a imagem
      const upload = await axios.post('http://localhost:3333/imagens', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filename = upload.data.path;

      // 2. Atualiza o evento com a imagem
      await axios.patch(`http://localhost:3333/eventos/${eventoSelecionado}/foto`, {
        filename,
      });

      alert('Imagem enviada e vinculada ao evento com sucesso!');
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar ou vincular imagem');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Upload de Imagem</h2>

      <label>Selecione um evento:</label>
      <select
        value={eventoSelecionado ?? ''}
        onChange={(e) => setEventoSelecionado(Number(e.target.value))}
        style={{ display: 'block', marginBottom: '10px', marginTop: '5px' }}
      >
        <option value="">-- Escolha um evento --</option>
        {eventos.map((evento) => (
          <option key={evento.id} value={evento.id}>
            {evento.nome}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] ?? null;
          setFile(selectedFile);
          if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
        }}
      />

      {preview && (
        <div style={{ marginTop: '15px' }}>
          <p>Pré-visualização:</p>
          <img
            src={preview}
            alt="Pré-visualização"
            style={{ maxWidth: '100%', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <button onClick={handleUpload} style={{ marginTop: '15px' }}>
        Enviar
      </button>
    </div>
  );
};

export default UploadImagem;
