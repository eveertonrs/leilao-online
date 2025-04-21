"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategorias = getCategorias;
exports.getCategoria = getCategoria;
exports.createCategoria = createCategoria;
exports.updateCategoria = updateCategoria;
exports.deleteCategoria = deleteCategoria;
const db_1 = __importDefault(require("../config/db"));
// Listar todas as categorias
async function getCategorias(req, res) {
    try {
        const result = await (await db_1.default).request().query(`
      SELECT id, nome, descricao, status, data_criacao, data_atualizacao FROM categorias
    `);
        res.status(200).json(result.recordset);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar categorias' });
    }
}
// Buscar uma categoria por ID
async function getCategoria(req, res) {
    const { id } = req.params;
    try {
        const result = await (await db_1.default).request()
            .input('id', Number(id))
            .query(`
        SELECT id, nome, descricao, status, data_criacao, data_atualizacao 
        FROM categorias 
        WHERE id = @id
      `);
        if (result.recordset.length === 0) {
            res.status(404).json({ mensagem: 'Categoria não encontrada' });
            return;
        }
        res.status(200).json(result.recordset[0]);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar categoria' });
    }
}
// Criar nova categoria
async function createCategoria(req, res) {
    const { nome, descricao, status } = req.body;
    if (!nome) {
        res.status(400).json({ mensagem: 'Campo "nome" é obrigatório' });
        return;
    }
    try {
        await (await db_1.default).request()
            .input('nome', nome)
            .input('descricao', descricao || null)
            .input('status', status || 'ativo')
            .query(`
        INSERT INTO categorias (nome, descricao, status, data_criacao)
        VALUES (@nome, @descricao, @status, GETDATE())
      `);
        res.status(201).json({ mensagem: 'Categoria criada com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar categoria' });
    }
}
// Atualizar categoria
async function updateCategoria(req, res) {
    const { id } = req.params;
    const { nome, descricao, status } = req.body;
    try {
        await (await db_1.default).request()
            .input('id', Number(id))
            .input('nome', nome)
            .input('descricao', descricao || null)
            .input('status', status || 'ativo')
            .input('data_atualizacao', new Date())
            .query(`
        UPDATE categorias
        SET nome = @nome,
            descricao = @descricao,
            status = @status,
            data_atualizacao = @data_atualizacao
        WHERE id = @id
      `);
        res.status(200).json({ mensagem: 'Categoria atualizada com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar categoria' });
    }
}
// Deletar categoria
async function deleteCategoria(req, res) {
    const { id } = req.params;
    try {
        await (await db_1.default).request()
            .input('id', Number(id))
            .query('DELETE FROM categorias WHERE id = @id');
        res.status(200).json({ mensagem: 'Categoria deletada com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar categoria' });
    }
}
