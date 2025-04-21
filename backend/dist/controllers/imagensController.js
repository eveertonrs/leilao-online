"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImagensPorLote = getImagensPorLote;
exports.createImagem = createImagem;
const db_1 = __importDefault(require("../config/db"));
// Listar imagens de um lote
async function getImagensPorLote(req, res) {
    const { lote_id } = req.params;
    try {
        const result = await (await db_1.default).request()
            .input('lote_id', Number(lote_id))
            .query(`
        SELECT id, url, lote_id
        FROM imagens
        WHERE lote_id = @lote_id
      `);
        res.status(200).json(result.recordset);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar imagens do lote' });
    }
}
// Criar imagem para um lote
async function createImagem(req, res) {
    const { url, lote_id } = req.body;
    if (!url || !lote_id) {
        res.status(400).json({ mensagem: 'Campos obrigatórios: url, lote_id' });
        return;
    }
    try {
        await (await db_1.default).request()
            .input('url', url)
            .input('lote_id', lote_id)
            .query(`
        INSERT INTO imagens (url, lote_id)
        VALUES (@url, @lote_id)
      `);
        res.status(201).json({ mensagem: 'Imagem cadastrada com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar imagem' });
    }
}
