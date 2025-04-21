import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import eventosRoutes from './routes/eventosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import lotesRoutes from './routes/lotesRoutes';
import lancesRoutes from './routes/lancesRoutes';
import imagensRoutes from './routes/imagensRoutes';


dotenv.config();

const app = express();

app.use(express.json());

app.use('/eventos', eventosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/lotes', lotesRoutes);
app.use('/lances', lancesRoutes);
app.use('/imagens', imagensRoutes);



app.get('/', (req: Request, res: Response) => {
  res.send('🚀 API de Leilão está funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

