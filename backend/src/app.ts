import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import eventosRoutes from './routes/eventosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import lotesRoutes from './routes/lotesRoutes';
import lancesRoutes from './routes/lancesRoutes';
import imagensRoutes from './routes/imagensRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/eventos', eventosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/lotes', lotesRoutes);
app.use('/lances', lancesRoutes);
app.use('/imagens', imagensRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 API de Leilão está funcionando!');
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
