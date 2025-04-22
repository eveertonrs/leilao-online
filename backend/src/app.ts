import express from 'express';
import cors from 'cors'; // ⬅️ Importa o cors
import * as dotenv from 'dotenv';
import eventosRoutes from './routes/eventosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import lotesRoutes from './routes/lotesRoutes';
import lancesRoutes from './routes/lancesRoutes';
import imagensRoutes from './routes/imagensRoutes';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors()); // ⬅️ Ativa o CORS para todas as rotas
app.use(express.json());

app.use('/eventos', eventosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/lotes', lotesRoutes);
app.use('/lances', lancesRoutes);
app.use('/imagens', imagensRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.send('🚀 API de Leilão está funcionando!');
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
