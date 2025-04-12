import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';

const tiposValidos = ['admin', 'usuario'];

export async function getUsuarios(req: Request, res: Response): Promise<void> {
  try {
    const result = await (await pool).request().query(`
      SELECT id, nome, email, tipo, data_cadastro FROM usuarios
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
  }
}

export async function getUsuario(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await (await pool).request()
      .input('id', Number(id))
      .query(`
        SELECT id, nome, email, tipo, data_cadastro 
        FROM usuarios WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
  }
}

export async function createUsuario(req: Request, res: Response): Promise<void> {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ mensagem: 'Campos obrigatórios: nome, email, senha' });
    return;
  }

  const tipoFinal = tipo || 'usuario';

  if (!tiposValidos.includes(tipoFinal)) {
    res.status(400).json({ mensagem: 'Tipo de usuário inválido. Use "admin" ou "usuario".' });
    return;
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);

    await (await pool).request()
      .input('nome', nome)
      .input('email', email)
      .input('senha_hash', senha_hash)
      .input('tipo', tipoFinal)
      .query(`
        INSERT INTO usuarios (nome, email, senha_hash, tipo, data_cadastro)
        VALUES (@nome, @email, @senha_hash, @tipo, GETDATE())
      `);

    res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ mensagem: 'Erro ao criar usuário', detalhe: error.message });
  }
}

export async function updateUsuario(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { nome, email, senha, tipo } = req.body;

  if (tipo && !tiposValidos.includes(tipo)) {
    res.status(400).json({ mensagem: 'Tipo de usuário inválido. Use "admin" ou "usuario".' });
    return;
  }

  try {
    const request = (await pool).request()
      .input('id', Number(id))
      .input('nome', nome)
      .input('email', email);

    if (tipo) {
      request.input('tipo', tipo);
    }

    if (senha) {
      const senha_hash = await bcrypt.hash(senha, 10);
      request.input('senha_hash', senha_hash);
    }

    await request.query(`
      UPDATE usuarios
      SET nome = @nome,
          email = @email
          ${tipo ? ', tipo = @tipo' : ''}
          ${senha ? ', senha_hash = @senha_hash' : ''}
      WHERE id = @id
    `);

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
  }
}

export async function deleteUsuario(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await (await pool).request()
      .input('id', Number(id))
      .query('DELETE FROM usuarios WHERE id = @id');

    res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
  }
}
