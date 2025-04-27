import { Request, Response, NextFunction } from 'express';

export function autenticarAdmin(req: Request, res: Response, next: NextFunction): void {
  const usuario = (req as any).user;

  if (!usuario || usuario.tipo !== 'ADMIN') {
    res.status(403).json({ mensagem: 'Acesso restrito: apenas administradores' });
    return;
  }

  next();
}
