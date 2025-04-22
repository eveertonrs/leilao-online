// src/controllers/eventosController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

// ✅ Função auxiliar para formatar datas para SQL
function formatDateToSQL(dateStr: string): string {
  return new Date(dateStr).toISOString().replace('T', ' ').slice(0, 19);
}

export async function getEventos(req: Request, res: Response) {
  try {
    const result = await (await pool).request().query('SELECT * FROM eventos');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar eventos' });
  }
}

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

export async function createEvento(req: Request, res: Response): Promise<void> {
  const { nome, data_inicio, data_fim, descricao } = req.body;
  const foto_capa = req.file?.filename || null;

  // ✅ Converte datas para formato aceito pelo SQL Server
  const dataInicioSQL = formatDateToSQL(data_inicio);
  const dataFimSQL = formatDateToSQL(data_fim);

  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

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

export async function updateEvento(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { nome, data_inicio, data_fim, descricao } = req.body;

  const dataInicioSQL = formatDateToSQL(data_inicio);
  const dataFimSQL = formatDateToSQL(data_fim);

  try {
    const request = (await pool).request();

    await request
      .input('id', Number(id))
      .input('nome', nome)
      .input('data_inicio', dataInicioSQL)
      .input('data_fim', dataFimSQL)
      .input('descricao', descricao || null)
      .query(`
        UPDATE eventos
        SET nome = @nome,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            descricao = @descricao
        WHERE id = @id
      `);

    res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ mensagem: 'Erro interno ao atualizar evento' });
  }
}

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
