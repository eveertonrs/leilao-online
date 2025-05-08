// ============================
// backend/src/controllers/lancesController.ts
// ============================
import { Request, Response } from 'express';
import pool from '../config/db';
import sql from 'mssql';

export async function getLancesPorLote(req: Request, res: Response): Promise<void> {
  const { loteId } = req.params;

  try {
    const result = await (await pool).request()
      .input('loteId', sql.Int, Number(loteId))
      .query(`
        SELECT l.valor, l.data_lance, u.nome AS usuario
        FROM lances l
        JOIN usuarios u ON u.id = l.usuario_id
        WHERE l.lote_id = @loteId
        ORDER BY l.valor DESC
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar lances' });
  }
}

export async function getMaiorLance(req: Request, res: Response): Promise<void> {
  const { loteId } = req.params;

  try {
    const result = await (await pool).request()
      .input('loteId', sql.Int, Number(loteId))
      .query(`
        SELECT TOP 1 valor
        FROM lances
        WHERE lote_id = @loteId
        ORDER BY valor DESC
      `);

    res.status(200).json(result.recordset[0] || { valor: 0 });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar maior lance' });
  }
}

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

export async function createLance(req: Request, res: Response): Promise<void> {
  const { valor, usuario_id, lote_id } = req.body;

  if (!valor || !usuario_id || !lote_id) {
    res.status(400).json({ mensagem: 'Campos obrigatórios: valor, usuario_id, lote_id' });
    return;
  }

  try {
    await (await pool).request()
      .input('valor', sql.Decimal(10, 2), valor)
      .input('usuario_id', sql.Int, usuario_id)
      .input('lote_id', sql.Int, lote_id)
      .query(`
        INSERT INTO lances (valor, usuario_id, lote_id, data_lance)
        VALUES (@valor, @usuario_id, @lote_id, GETDATE())
      `);

    res.status(201).json({ mensagem: 'Lance criado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar lance' });
  }
}