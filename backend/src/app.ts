import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

import eventosRoutes from './routes/eventosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import lotesRoutes from './routes/lotesRoutes';
import lancesRoutes from './routes/lancesRoutes';
import imagensRoutes from './routes/imagensRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir imagens estaticamente
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas da aplicação
app.use('/eventos', eventosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/lotes', lotesRoutes);
app.use('/lances', lancesRoutes);
app.use('/imagens', imagensRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 API de Leilão está funcionando!');
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
