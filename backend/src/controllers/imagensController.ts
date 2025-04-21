import { Request, Response } from 'express';
import pool from '../config/db';

// Listar imagens de um lote
export async function getImagensPorLote(req: Request, res: Response): Promise<void> {
  const { lote_id } = req.params;

  try {
    const result = await (await pool).request()
      .input('lote_id', Number(lote_id))
      .query(`
        SELECT id, url, lote_id
        FROM imagens
        WHERE lote_id = @lote_id
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar imagens do lote' });
  }
}

// Criar imagem para um lote
export async function createImagem(req: Request, res: Response): Promise<void> {
  const { url, lote_id } = req.body;

  if (!url || !lote_id) {
    res.status(400).json({ mensagem: 'Campos obrigatórios: url, lote_id' });
    return;
  }

  try {
    await (await pool).request()
      .input('url', url)
      .input('lote_id', lote_id)
      .query(`
        INSERT INTO imagens (url, lote_id)
        VALUES (@url, @lote_id)
      `);

    res.status(201).json({ mensagem: 'Imagem cadastrada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar imagem' });
  }
}
