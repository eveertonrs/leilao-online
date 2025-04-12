import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import eventosRoutes from './routes/eventosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/eventos', eventosRoutes);
app.use('/usuarios', usuariosRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 API de Leilão está funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

