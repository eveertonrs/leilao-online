"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lotesController_1 = require("../controllers/lotesController");
const loteImagensController_1 = require("../controllers/loteImagensController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const mssql_1 = __importDefault(require("mssql"));
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
// Configuração do multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
// ⚠️ Essa rota deve vir antes de qualquer rota que use "/:id"
router.post('/:id/imagens', upload.array('imagens', 10), loteImagensController_1.uploadLoteImagens);
// 🔍 NOVA ROTA: Buscar todos os lotes de um evento específico
router.get('/evento/:eventoId', async (req, res) => {
    const { eventoId } = req.params;
    try {
        const conn = await db_1.default;
        const result = await conn.request()
            .input('eventoId', mssql_1.default.Int, parseInt(eventoId))
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
        const lotes = result.recordset.map((row) => ({
            ...row,
            imagens: row.imagens ? JSON.parse(row.imagens).map((img) => img.url) : []
        }));
        res.status(200).json(lotes);
    }
    catch (err) {
        console.error('Erro ao buscar lotes por evento:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar lotes por evento' });
    }
});
// CRUD padrão
router.get('/', lotesController_1.getLotes);
router.get('/:id', lotesController_1.getLote);
router.post('/', lotesController_1.createLote);
router.put('/:id', lotesController_1.updateLote);
router.delete('/:id', lotesController_1.deleteLote);
exports.default = router;
