import { Router } from 'express';
import {
  getLotes,
  getLote,
  createLote,
  updateLote,
  deleteLote
} from '../controllers/lotesController';

import { uploadLoteImagens } from '../controllers/loteImagensController';

import multer from 'multer';
import path from 'path';
import sql from 'mssql';
import pool from '../config/db';

const router = Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ⚠️ Essa rota deve vir antes de qualquer rota que use "/:id"
router.post('/:id/imagens', upload.array('imagens', 10), uploadLoteImagens);

// 🔍 NOVA ROTA: Buscar todos os lotes de um evento específico
router.get('/evento/:eventoId', async (req, res) => {
  const { eventoId } = req.params;

  try {
    const conn = await pool;
    const result = await conn.request()
      .input('eventoId', sql.Int, parseInt(eventoId))
      .query(`
        SELECT 
          l.*,
          e.nome AS evento_nome,
          c.nome AS categoria_nome,
          (
            SELECT url 
            FROM lote_imagens 
            WHERE lote_id = l.id 
            FOR JSON PATH
          ) AS imagens
        FROM lotes l
        JOIN eventos e ON l.evento_id = e.id
        JOIN categorias c ON l.categoria_id = c.id
        WHERE l.evento_id = @eventoId
      `);

    const lotes = result.recordset.map((row: any) => ({
      ...row,
      imagens: row.imagens ? JSON.parse(row.imagens).map((img: any) => img.url) : []
    }));

    res.status(200).json(lotes);
  } catch (err) {
    console.error('Erro ao buscar lotes por evento:', err);
    res.status(500).json({ mensagem: 'Erro ao buscar lotes por evento' });
  }
});

// CRUD padrão
router.get('/', getLotes);
router.get('/:id', getLote);
router.post('/', createLote);
router.put('/:id', updateLote);
router.delete('/:id', deleteLote);

export default router;
