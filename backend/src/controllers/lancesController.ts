import { Request, Response } from 'express';
import pool from '../config/db';

// Listar todos os lances
export async function getLances(req: Request, res: Response): Promise<void> {
  try {
    const result = await (await pool).request().query(`
      SELECT id, valor, usuario_id, lote_id, data_lance
      FROM lances
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar lances' });
  }
}

// Criar um novo lance
export async function createLance(req: Request, res: Response): Promise<void> {
  const { valor, usuario_id, lote_id } = req.body;

  if (!valor || !usuario_id || !lote_id) {
    res.status(400).json({ mensagem: 'Campos obrigatórios: valor, usuario_id, lote_id' });
    return;
  }

  try {
    await (await pool).request()
      .input('valor', valor)
      .input('usuario_id', usuario_id)
      .input('lote_id', lote_id)
      .query(`
        INSERT INTO lances (valor, usuario_id, lote_id, data_lance)
        VALUES (@valor, @usuario_id, @lote_id, GETDATE())
      `);

    res.status(201).json({ mensagem: 'Lance criado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar lance' });
  }
}
