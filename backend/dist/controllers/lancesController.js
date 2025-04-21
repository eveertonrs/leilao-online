"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLances = getLances;
exports.createLance = createLance;
const db_1 = __importDefault(require("../config/db"));
// Listar todos os lances
async function getLances(req, res) {
    try {
        const result = await (await db_1.default).request().query(`
      SELECT id, valor, usuario_id, lote_id, data_lance
      FROM lances
    `);
        res.status(200).json(result.recordset);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar lances' });
    }
}
// Criar um novo lance
async function createLance(req, res) {
    const { valor, usuario_id, lote_id } = req.body;
    if (!valor || !usuario_id || !lote_id) {
        res.status(400).json({ mensagem: 'Campos obrigatórios: valor, usuario_id, lote_id' });
        return;
    }
    try {
        await (await db_1.default).request()
            .input('valor', valor)
            .input('usuario_id', usuario_id)
            .input('lote_id', lote_id)
            .query(`
        INSERT INTO lances (valor, usuario_id, lote_id, data_lance)
        VALUES (@valor, @usuario_id, @lote_id, GETDATE())
      `);
        res.status(201).json({ mensagem: 'Lance criado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar lance' });
    }
}
