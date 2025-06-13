"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLancesPorLote = getLancesPorLote;
exports.getMaiorLance = getMaiorLance;
exports.getLances = getLances;
exports.createLance = createLance;
const db_1 = __importDefault(require("../config/db"));
const mssql_1 = __importDefault(require("mssql"));
async function getLancesPorLote(req, res) {
    const { loteId } = req.params;
    try {
        const result = await (await db_1.default).request()
            .input('loteId', mssql_1.default.Int, Number(loteId))
            .query(`
        SELECT l.valor, l.data_lance, u.nome AS usuario
        FROM lances l
        JOIN usuarios u ON u.id = l.usuario_id
        WHERE l.lote_id = @loteId
        ORDER BY l.valor DESC
      `);
        res.status(200).json(result.recordset);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar lances' });
    }
}
async function getMaiorLance(req, res) {
    const { loteId } = req.params;
    try {
        const result = await (await db_1.default).request()
            .input('loteId', mssql_1.default.Int, Number(loteId))
            .query(`
        SELECT TOP 1 valor
        FROM lances
        WHERE lote_id = @loteId
        ORDER BY valor DESC
      `);
        res.status(200).json(result.recordset[0] || { valor: 0 });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar maior lance' });
    }
}
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
async function createLance(req, res) {
    const { valor, usuario_id, lote_id } = req.body;
    if (!valor || !usuario_id || !lote_id) {
        res.status(400).json({ mensagem: 'Campos obrigatórios: valor, usuario_id, lote_id' });
        return;
    }
    try {
        await (await db_1.default).request()
            .input('valor', mssql_1.default.Decimal(10, 2), valor)
            .input('usuario_id', mssql_1.default.Int, usuario_id)
            .input('lote_id', mssql_1.default.Int, lote_id)
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
