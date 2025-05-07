import { Request, Response } from 'express';
import sql from 'mssql';
import pool from '../config/db';

// Upload de imagens vinculadas a um lote existente
export async function uploadLoteImagens(req: Request, res: Response): Promise<void> {
  const lote_id = parseInt(req.params.id, 10);
  const arquivos = req.files as Express.Multer.File[];

  if (!lote_id || isNaN(lote_id) || !arquivos || arquivos.length === 0) {
    res.status(400).json({ mensagem: 'Lote ID e imagens são obrigatórios.' });
    return;
  }

  try {
    const conn = await pool;

    for (const file of arquivos) {
      const url = `/uploads/${file.filename}`;

      await conn.request()
        .input('lote_id', sql.Int, lote_id)
        .input('url', sql.VarChar(500), url)
        .query(`
          INSERT INTO lote_imagens (lote_id, url)
          VALUES (@lote_id, @url)
        `);
    }

    res.status(201).json({ mensagem: 'Imagens salvas com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar imagens do lote:', error);
    res.status(500).json({ mensagem: 'Erro interno ao salvar imagens' });
  }
}
