"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLotes = getLotes;
exports.getLote = getLote;
exports.createLote = createLote;
exports.updateLote = updateLote;
exports.deleteLote = deleteLote;
const db_1 = __importDefault(require("../config/db"));
// Listar todos os lotes
async function getLotes(req, res) {
    try {
        const result = await (await db_1.default).request().query(`
      SELECT 
        l.id, l.nome, l.descricao, l.lance_minimo, 
        l.data_inicio, l.data_fim, 
        l.evento_id, e.nome AS evento_nome, 
        l.categoria_id, c.nome AS categoria_nome 
      FROM lotes l
      JOIN eventos e ON l.evento_id = e.id
      JOIN categorias c ON l.categoria_id = c.id
    `);
        res.status(200).json(result.recordset);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar lotes' });
    }
}
// Buscar um lote por ID
async function getLote(req, res) {
    const { id } = req.params;
    try {
        const result = await (await db_1.default).request()
            .input('id', Number(id))
            .query(`
        SELECT 
          l.id, l.nome, l.descricao, l.lance_minimo, 
          l.data_inicio, l.data_fim, 
          l.evento_id, e.nome AS evento_nome, 
          l.categoria_id, c.nome AS categoria_nome 
        FROM lotes l
        JOIN eventos e ON l.evento_id = e.id
        JOIN categorias c ON l.categoria_id = c.id
        WHERE l.id = @id
      `);
        if (result.recordset.length === 0) {
            res.status(404).json({ mensagem: 'Lote não encontrado' });
            return;
        }
        res.status(200).json(result.recordset[0]);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar lote' });
    }
}
// Criar novo lote
async function createLote(req, res) {
    const { nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id } = req.body;
    if (!nome || !lance_minimo || !data_inicio || !data_fim || !evento_id || !categoria_id) {
        res.status(400).json({ mensagem: 'Campos obrigatórios: nome, lance_minimo, data_inicio, data_fim, evento_id, categoria_id' });
        return;
    }
    try {
        await (await db_1.default).request()
            .input('nome', nome)
            .input('descricao', descricao || null)
            .input('lance_minimo', lance_minimo)
            .input('data_inicio', data_inicio)
            .input('data_fim', data_fim)
            .input('evento_id', evento_id)
            .input('categoria_id', categoria_id)
            .query(`
        INSERT INTO lotes (nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id)
        VALUES (@nome, @descricao, @lance_minimo, @data_inicio, @data_fim, @evento_id, @categoria_id)
      `);
        res.status(201).json({ mensagem: 'Lote criado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar lote' });
    }
}
// Atualizar lote
async function updateLote(req, res) {
    const { id } = req.params;
    const { nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id } = req.body;
    try {
        await (await db_1.default).request()
            .input('id', Number(id))
            .input('nome', nome)
            .input('descricao', descricao || null)
            .input('lance_minimo', lance_minimo)
            .input('data_inicio', data_inicio)
            .input('data_fim', data_fim)
            .input('evento_id', evento_id)
            .input('categoria_id', categoria_id)
            .query(`
        UPDATE lotes
        SET nome = @nome,
            descricao = @descricao,
            lance_minimo = @lance_minimo,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            evento_id = @evento_id,
            categoria_id = @categoria_id
        WHERE id = @id
      `);
        res.status(200).json({ mensagem: 'Lote atualizado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar lote' });
    }
}
// Deletar lote
async function deleteLote(req, res) {
    const { id } = req.params;
    try {
        await (await db_1.default).request()
            .input('id', Number(id))
            .query('DELETE FROM lotes WHERE id = @id');
        res.status(200).json({ mensagem: 'Lote deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar lote' });
    }
}
