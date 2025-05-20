import { Request, Response } from 'express';
import pool from '../config/db';

// Função auxiliar para formatar datas para SQL Server
function formatDateToSQL(dateStr: string): string {
  return new Date(dateStr).toISOString().replace('T', ' ').slice(0, 19);
}

// Buscar todos os eventos
export async function getEventos(req: Request, res: Response) {
  try {
    const result = await (await pool).request().query('SELECT * FROM eventos');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar eventos' });
  }
}

// Buscar evento por ID
export async function getEvento(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const request = (await pool).request();
    const result = await request.input('id', Number(id)).query('SELECT * FROM eventos WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ mensagem: 'Evento não encontrado' });
      return;
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ mensagem: 'Erro interno ao buscar evento' });
  }
}

// Criar novo evento
export async function createEvento(req: Request, res: Response): Promise<void> {
  const { nome, data_inicio, data_fim, descricao } = req.body;
  const foto_capa = req.file?.filename || null;

  const dataInicioSQL = formatDateToSQL(data_inicio);
  const dataFimSQL = formatDateToSQL(data_fim);

  // Validação de datas: apenas garantir fim > início
  const inicio = new Date(data_inicio);
  const fim = new Date(data_fim);
  if (fim <= inicio) {
    res.status(400).json({ mensagem: 'A data de fim deve ser posterior à data de início' });
    return;
  }

  try {
    const request = (await pool).request();
    await request
      .input('nome', nome)
      .input('data_inicio', dataInicioSQL)
      .input('data_fim', dataFimSQL)
      .input('descricao', descricao || null)
      .input('foto_capa', foto_capa)
      .query(`
        INSERT INTO eventos (nome, data_inicio, data_fim, descricao, foto_capa)
        VALUES (@nome, @data_inicio, @data_fim, @descricao, @foto_capa)
      `);

    res.status(201).json({ mensagem: 'Evento criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ mensagem: 'Erro ao criar evento' });
  }
}

// Atualizar evento existente
export async function updateEvento(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { nome, data_inicio, data_fim, descricao } = req.body;
  const foto_capa = req.file?.filename || null;

  console.log('--- RECEBIDO NO UPDATE ---');
  console.log('ID:', id);
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  // 🕒 Formatar datas
  const dataInicioSQL = formatDateToSQL(data_inicio);
  const dataFimSQL = formatDateToSQL(data_fim);

  // ✅ Validação Backend
  const now = new Date();
  const inicio = new Date(data_inicio);
  const fim = new Date(data_fim);

  // if (inicio < now) {
  //   console.log('Erro: Data de início é anterior à data atual');
  //   res.status(400).json({ mensagem: 'A data de início não pode ser anterior à data atual' });
  //   return;
  // }

  // if (fim <= inicio) {
  //   console.log('Erro: Data de fim é anterior ou igual à data de início');
  //   res.status(400).json({ mensagem: 'A data de fim deve ser posterior à data de início' });
  //   return;
  // }

  try {
    const request = (await pool).request();
    request.input('id', Number(id))
      .input('nome', nome)
      .input('data_inicio', dataInicioSQL)
      .input('data_fim', dataFimSQL)
      .input('descricao', descricao || null);

    if (foto_capa) {
      request.input('foto_capa', foto_capa);
      console.log('Atualizando COM nova imagem...');
      await request.query(`
        UPDATE eventos
        SET nome = @nome,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            descricao = @descricao,
            foto_capa = @foto_capa
        WHERE id = @id
      `);
    } else {
      console.log('Atualizando SEM nova imagem...');
      await request.query(`
        UPDATE eventos
        SET nome = @nome,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            descricao = @descricao
        WHERE id = @id
      `);
    }

    console.log('Evento atualizado com sucesso');
    res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ mensagem: 'Erro interno ao atualizar evento' });
  }
}


// Excluir evento
export async function deleteEvento(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const request = (await pool).request();
    await request.input('id', Number(id)).query('DELETE FROM eventos WHERE id = @id');

    res.status(200).json({ mensagem: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ mensagem: 'Erro interno ao deletar evento' });
  }
}
