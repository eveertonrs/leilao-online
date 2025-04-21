import { Request, Response } from 'express';
import pool from '../config/db';

// Listar todas as categorias
export async function getCategorias(req: Request, res: Response): Promise<void> {
  try {
    const result = await (await pool).request().query(`
      SELECT id, nome, descricao, status, data_criacao, data_atualizacao FROM categorias
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar categorias' });
  }
}

// Buscar uma categoria por ID
export async function getCategoria(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await (await pool).request()
      .input('id', Number(id))
      .query(`
        SELECT id, nome, descricao, status, data_criacao, data_atualizacao 
        FROM categorias 
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ mensagem: 'Categoria não encontrada' });
      return;
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar categoria' });
  }
}

// Criar nova categoria
export async function createCategoria(req: Request, res: Response): Promise<void> {
  const { nome, descricao, status } = req.body;

  if (!nome) {
    res.status(400).json({ mensagem: 'Campo "nome" é obrigatório' });
    return;
  }

  try {
    await (await pool).request()
      .input('nome', nome)
      .input('descricao', descricao || null)
      .input('status', status || 'ativo')
      .query(`
        INSERT INTO categorias (nome, descricao, status, data_criacao)
        VALUES (@nome, @descricao, @status, GETDATE())
      `);

    res.status(201).json({ mensagem: 'Categoria criada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar categoria' });
  }
}

// Atualizar categoria
export async function updateCategoria(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { nome, descricao, status } = req.body;

  try {
    await (await pool).request()
      .input('id', Number(id))
      .input('nome', nome)
      .input('descricao', descricao || null)
      .input('status', status || 'ativo')
      .input('data_atualizacao', new Date())
      .query(`
        UPDATE categorias
        SET nome = @nome,
            descricao = @descricao,
            status = @status,
            data_atualizacao = @data_atualizacao
        WHERE id = @id
      `);

    res.status(200).json({ mensagem: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar categoria' });
  }
}

// Deletar categoria
export async function deleteCategoria(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await (await pool).request()
      .input('id', Number(id))
      .query('DELETE FROM categorias WHERE id = @id');

    res.status(200).json({ mensagem: 'Categoria deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar categoria' });
  }
}
