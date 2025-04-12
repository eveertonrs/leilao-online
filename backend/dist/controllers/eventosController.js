"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventos = getEventos;
exports.getEvento = getEvento;
exports.createEvento = createEvento;
exports.updateEvento = updateEvento;
exports.deleteEvento = deleteEvento;
const db_1 = __importDefault(require("../config/db"));
async function getEventos(req, res) {
    try {
        const result = await (await db_1.default).request().query('SELECT * FROM eventos');
        res.status(200).json(result.recordset);
    }
    catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos' });
    }
}
async function getEvento(req, res) {
    const { id } = req.params;
    try {
        const request = (await db_1.default).request();
        const result = await request.input('id', Number(id)).query('SELECT * FROM eventos WHERE id = @id');
        if (result.recordset.length === 0) {
            res.status(404).json({ mensagem: 'Evento não encontrado' });
            return;
        }
        res.status(200).json(result.recordset[0]);
    }
    catch (error) {
        console.error('Erro ao buscar evento:', error);
        res.status(500).json({ mensagem: 'Erro interno ao buscar evento' });
    }
}
async function createEvento(req, res) {
    const { nome, data_inicio, data_fim, descricao } = req.body;
    if (!nome || !data_inicio || !data_fim) {
        res.status(400).json({
            mensagem: 'Campos obrigatórios: nome, data_inicio, data_fim',
        });
        return;
    }
    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        res.status(400).json({
            mensagem: 'Datas inválidas. Use o formato ISO ou uma data válida.',
        });
        return;
    }
    if (inicio >= fim) {
        res.status(400).json({
            mensagem: 'A data de início deve ser anterior à data de fim',
        });
        return;
    }
    try {
        const request = (await db_1.default).request();
        await request
            .input('nome', nome)
            .input('data_inicio', data_inicio)
            .input('data_fim', data_fim)
            .input('descricao', descricao || null)
            .query(`
        INSERT INTO eventos (nome, data_inicio, data_fim, descricao)
        VALUES (@nome, @data_inicio, @data_fim, @descricao)
      `);
        res.status(201).json({ mensagem: 'Evento criado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({
            mensagem: 'Erro interno ao criar evento',
            detalhe: error.message,
        });
    }
}
async function updateEvento(req, res) {
    const { id } = req.params;
    const { nome, data_inicio, data_fim, descricao } = req.body;
    try {
        const request = (await db_1.default).request();
        await request
            .input('id', Number(id))
            .input('nome', nome)
            .input('data_inicio', data_inicio)
            .input('data_fim', data_fim)
            .input('descricao', descricao || null)
            .query(`
        UPDATE eventos
        SET nome = @nome,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            descricao = @descricao
        WHERE id = @id
      `);
        res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao atualizar evento:', error);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar evento' });
    }
}
async function deleteEvento(req, res) {
    const { id } = req.params;
    try {
        const request = (await db_1.default).request();
        await request.input('id', Number(id)).query('DELETE FROM eventos WHERE id = @id');
        res.status(200).json({ mensagem: 'Evento excluído com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar evento:', error);
        res.status(500).json({ mensagem: 'Erro interno ao deletar evento' });
    }
}
