import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'seuSegredoSuperSeguro';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, senha } = req.body;
  try {
    const request = (await pool).request();
    const result = await request.input('email', email).query('SELECT * FROM usuarios WHERE email = @email AND tipo = \'USER\'');

    if (result.recordset.length === 0) {
      res.status(401).json({ mensagem: 'Usuário não encontrado' });
      return;
    }

    const usuario = result.recordset[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      res.status(401).json({ mensagem: 'Senha incorreta' });
      return;
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
}

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const { email, senha } = req.body;
  try {
    const request = (await pool).request();
    const result = await request.input('email', email).query('SELECT * FROM usuarios WHERE email = @email AND tipo = \'ADMIN\'');

    if (result.recordset.length === 0) {
      res.status(401).json({ mensagem: 'Usuário não encontrado' });
      return;
    }

    const usuario = result.recordset[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      res.status(401).json({ mensagem: 'Senha incorreta' });
      return;
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
}
