import { Request, Response } from 'express';
import sql from 'mssql';
import pool from '../config/db';

export async function getLotes(req: Request, res: Response): Promise<void> {
  try {
    const conn = await pool;
    const resultLotes = await conn.request().query(`
      SELECT 
        l.id, l.nome, l.descricao, l.lance_minimo, 
        l.data_inicio, l.data_fim, 
        l.evento_id, e.nome AS evento_nome, 
        l.categoria_id, c.nome AS categoria_nome,
        l.status, l.lance_atual, l.qtd_lances, l.comissao
      FROM lotes l
      JOIN eventos e ON l.evento_id = e.id
      JOIN categorias c ON l.categoria_id = c.id
    `);

    const lotes = resultLotes.recordset;

    for (const lote of lotes) {
      const imagens = await conn.request()
        .input('lote_id', sql.Int, lote.id)
        .query(`SELECT id, url FROM lote_imagens WHERE lote_id = @lote_id`);

      lote.imagens = imagens.recordset.map(img => `http://localhost:3333${img.url}`);
    }

    res.status(200).json(lotes);
  } catch (error) {
    console.error('Erro ao buscar lotes:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar lotes' });
  }
}

export async function getLote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const conn = await pool;
    const resultLote = await conn.request()
      .input('id', sql.Int, Number(id))
      .query(`
        SELECT 
          l.id, l.nome, l.descricao, l.lance_minimo, 
          l.data_inicio, l.data_fim, 
          l.evento_id, e.nome AS evento_nome, 
          l.categoria_id, c.nome AS categoria_nome,
          l.status, l.lance_atual, l.qtd_lances, l.comissao
        FROM lotes l
        JOIN eventos e ON l.evento_id = e.id
        JOIN categorias c ON l.categoria_id = c.id
        WHERE l.id = @id
      `);

    if (resultLote.recordset.length === 0) {
      res.status(404).json({ mensagem: 'Lote não encontrado' });
      return;
    }

    const lote = resultLote.recordset[0];

    const resultImagens = await conn.request()
      .input('lote_id', sql.Int, Number(id))
      .query(`SELECT id, url FROM lote_imagens WHERE lote_id = @lote_id`);

    lote.imagens = resultImagens.recordset.map(img => `http://localhost:3333${img.url}`);

    res.status(200).json(lote);
  } catch (error) {
    console.error('Erro ao buscar lote:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar lote' });
  }
}

export async function createLote(req: Request, res: Response): Promise<void> {
  const { nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id, comissao } = req.body;

  try {
    const conn = await pool;
    const result = await conn.request()
      .input('nome', sql.VarChar, nome)
      .input('descricao', sql.VarChar, descricao || null)
      .input('lance_minimo', sql.Decimal(18, 2), parseFloat(lance_minimo))
      .input('data_inicio', sql.DateTime, new Date(data_inicio))
      .input('data_fim', sql.DateTime, new Date(data_fim))
      .input('evento_id', sql.Int, evento_id)
      .input('categoria_id', sql.Int, categoria_id)
      .input('status', sql.VarChar, 'pendente')
      .input('lance_atual', sql.Decimal(18, 2), null)
      .input('qtd_lances', sql.Int, 0)
      .input('comissao', sql.Decimal(10, 2), parseFloat(comissao))
      .query(`
        INSERT INTO lotes 
        (nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id, status, lance_atual, qtd_lances, comissao)
        OUTPUT INSERTED.id
        VALUES 
        (@nome, @descricao, @lance_minimo, @data_inicio, @data_fim, @evento_id, @categoria_id, @status, @lance_atual, @qtd_lances, @comissao)
      `);

    res.status(201).json({ mensagem: 'Lote criado com sucesso', id: result.recordset[0].id });
  } catch (error) {
    console.error('Erro ao criar lote:', error);
    res.status(500).json({ mensagem: 'Erro ao criar lote' });
  }
}

export async function updateLote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id, comissao } = req.body;
  const imagens = req.files && Array.isArray(req.files) ? req.files : [];

  try {
    const conn = await pool;

    await conn.request()
      .input('id', Number(id))
      .input('nome', nome)
      .input('descricao', descricao || null)
      .input('lance_minimo', sql.Decimal(18, 2), parseFloat(lance_minimo))
      .input('data_inicio', new Date(data_inicio))
      .input('data_fim', new Date(data_fim))
      .input('evento_id', evento_id)
      .input('categoria_id', categoria_id)
      .input('comissao', sql.Decimal(10, 2), parseFloat(comissao))
      .query(`
        UPDATE lotes
        SET nome = @nome,
            descricao = @descricao,
            lance_minimo = @lance_minimo,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            evento_id = @evento_id,
            categoria_id = @categoria_id,
            comissao = @comissao
        WHERE id = @id
      `);

    await conn.request()
      .input('lote_id', Number(id))
      .query(`DELETE FROM lote_imagens WHERE lote_id = @lote_id`);

    for (const file of imagens) {
      const imageUrl = `/uploads/${file.filename}`;
      await conn.request()
        .input('lote_id', Number(id))
        .input('url', imageUrl)
        .query(`INSERT INTO lote_imagens (lote_id, url) VALUES (@lote_id, @url)`);
    }

    res.status(200).json({ mensagem: 'Lote atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar lote:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar lote' });
  }
}

export async function deleteLote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await (await pool).request()
      .input('id', sql.Int, Number(id))
      .query('DELETE FROM lotes WHERE id = @id');

    res.status(200).json({ mensagem: 'Lote deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar lote:', error);
    res.status(500).json({ mensagem: 'Erro ao deletar lote' });
  }
}
