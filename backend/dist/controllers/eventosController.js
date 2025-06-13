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
// Função auxiliar para formatar datas para SQL Server
function formatDateToSQL(dateStr) {
    return new Date(dateStr).toISOString().replace('T', ' ').slice(0, 19);
}
// Buscar todos os eventos
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
// Buscar evento por ID
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
// Criar novo evento
async function createEvento(req, res) {
    const { nome, data_inicio, data_fim, descricao } = req.body;
    const foto_capa = req.file?.filename || null;
    const dataInicioSQL = formatDateToSQL(data_inicio);
    const dataFimSQL = formatDateToSQL(data_fim);
    // Validação de datas
    const now = new Date();
    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    if (inicio < now) {
        const hojeFormatado = new Date().toLocaleDateString('pt-BR');
        res.status(400).json({
            mensagem: `A data de início não pode ser anterior à data atual (${hojeFormatado}) ou igual a Hoje..`
        });
        return;
    }
    if (fim <= inicio) {
        res.status(400).json({ mensagem: 'A data de fim deve ser posterior à data de início' });
        return;
    }
    try {
        const request = (await db_1.default).request();
        await request
            .input('nome', nome)
            .input('data_inicio', dataInicioSQL)
            .input('data_fim', dataFimSQL)
            .input('descricao', descricao || null)
            .input('foto_capa', foto_capa)
            .query(`
        INSERT INTO eventos (nome, data_inicio, data_fim, descricao, foto_capa)
        VALUES (@nome, @data_inicio, @data_fim, @descricao, @foto_capa)
      `);
        res.status(201).json({ mensagem: 'Evento criado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ mensagem: 'Erro ao criar evento' });
    }
}
// Atualizar evento existente
async function updateEvento(req, res) {
    const { id } = req.params;
    const { nome, data_inicio, data_fim, descricao } = req.body;
    const foto_capa = req.file?.filename || null;
    console.log('--- RECEBIDO NO UPDATE ---');
    console.log('ID:', id);
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    // 🕒 Formatar datas
    const dataInicioSQL = formatDateToSQL(data_inicio);
    const dataFimSQL = formatDateToSQL(data_fim);
    // ✅ Validação Backend
    const now = new Date();
    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    // if (inicio < now) {
    //   console.log('Erro: Data de início é anterior à data atual');
    //   res.status(400).json({ mensagem: 'A data de início não pode ser anterior à data atual' });
    //   return;
    // }
    // if (fim <= inicio) {
    //   console.log('Erro: Data de fim é anterior ou igual à data de início');
    //   res.status(400).json({ mensagem: 'A data de fim deve ser posterior à data de início' });
    //   return;
    // }
    try {
        const request = (await db_1.default).request();
        request.input('id', Number(id))
            .input('nome', nome)
            .input('data_inicio', dataInicioSQL)
            .input('data_fim', dataFimSQL)
            .input('descricao', descricao || null);
        if (foto_capa) {
            request.input('foto_capa', foto_capa);
            console.log('Atualizando COM nova imagem...');
            await request.query(`
        UPDATE eventos
        SET nome = @nome,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            descricao = @descricao,
            foto_capa = @foto_capa
        WHERE id = @id
      `);
        }
        else {
            console.log('Atualizando SEM nova imagem...');
            await request.query(`
        UPDATE eventos
        SET nome = @nome,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            descricao = @descricao
        WHERE id = @id
      `);
        }
        console.log('Evento atualizado com sucesso');
        res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao atualizar evento:', error);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar evento' });
    }
}
// Excluir evento com verificação de lotes vinculados
async function deleteEvento(req, res) {
    const { id } = req.params;
    try {
        const db = await db_1.default;
        // Verifica se há lotes vinculados a este evento
        const lotesResult = await db
            .request()
            .input('evento_id', Number(id))
            .query('SELECT id FROM lotes WHERE evento_id = @evento_id');
        if (lotesResult.recordset.length > 0) {
            const ids = lotesResult.recordset.map((lote) => lote.id).join(', ');
            res.status(400).json({
                mensagem: `Este evento possui ${lotesResult.recordset.length} lote(s) vinculado(s) com ID(s): ${ids}. Remova-os antes de excluir o evento.`
            });
            return;
        }
        // Nenhum lote vinculado → pode excluir
        await db.request()
            .input('id', Number(id))
            .query('DELETE FROM eventos WHERE id = @id');
        res.status(200).json({ mensagem: 'Evento excluído com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar evento:', error);
        res.status(500).json({ mensagem: 'Erro interno ao deletar evento' });
    }
}
