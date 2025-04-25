import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'seuSegredoSuperSeguro';

export function autenticarToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ mensagem: 'Token não fornecido' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) {
      res.status(403).json({ mensagem: 'Token inválido' });
      return;
    }

    (req as any).user = usuario;
    next();
  });
}
