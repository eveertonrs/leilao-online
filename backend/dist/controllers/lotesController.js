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
const mssql_1 = __importDefault(require("mssql"));
const db_1 = __importDefault(require("../config/db"));
async function getLotes(req, res) {
    try {
        const conn = await db_1.default;
        const resultLotes = await conn.request().query(`
      SELECT 
        l.id, l.nome, l.descricao, l.lance_minimo, 
        l.data_inicio, l.data_fim, 
        l.evento_id, e.nome AS evento_nome, 
        l.categoria_id, c.nome AS categoria_nome,
        l.status, l.lance_atual, l.qtd_lances, l.comissao
      FROM lotes l
      JOIN eventos e ON l.evento_id = e.id
      JOIN categorias c ON l.categoria_id = c.id
    `);
        const lotes = resultLotes.recordset;
        for (const lote of lotes) {
            const imagens = await conn.request()
                .input('lote_id', mssql_1.default.Int, lote.id)
                .query(`SELECT id, url FROM lote_imagens WHERE lote_id = @lote_id`);
            lote.imagens = imagens.recordset.map(img => `http://localhost:3333${img.url}`);
        }
        res.status(200).json(lotes);
    }
    catch (error) {
        console.error('Erro ao buscar lotes:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar lotes' });
    }
}
async function getLote(req, res) {
    const { id } = req.params;
    try {
        const conn = await db_1.default;
        const resultLote = await conn.request()
            .input('id', mssql_1.default.Int, Number(id))
            .query(`
        SELECT 
          l.id, l.nome, l.descricao, l.lance_minimo, 
          l.data_inicio, l.data_fim, 
          l.evento_id, e.nome AS evento_nome, 
          l.categoria_id, c.nome AS categoria_nome,
          l.status, l.lance_atual, l.qtd_lances, l.comissao
        FROM lotes l
        JOIN eventos e ON l.evento_id = e.id
        JOIN categorias c ON l.categoria_id = c.id
        WHERE l.id = @id
      `);
        if (resultLote.recordset.length === 0) {
            res.status(404).json({ mensagem: 'Lote não encontrado' });
            return;
        }
        const lote = resultLote.recordset[0];
        const resultImagens = await conn.request()
            .input('lote_id', mssql_1.default.Int, Number(id))
            .query(`SELECT id, url FROM lote_imagens WHERE lote_id = @lote_id`);
        lote.imagens = resultImagens.recordset.map(img => `http://localhost:3333${img.url}`);
        res.status(200).json(lote);
    }
    catch (error) {
        console.error('Erro ao buscar lote:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar lote' });
    }
}
async function createLote(req, res) {
    const { nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id, comissao } = req.body;
    try {
        const conn = await db_1.default;
        const result = await conn.request()
            .input('nome', mssql_1.default.VarChar, nome)
            .input('descricao', mssql_1.default.VarChar, descricao || null)
            .input('lance_minimo', mssql_1.default.Decimal(18, 2), parseFloat(lance_minimo))
            .input('data_inicio', mssql_1.default.DateTime, new Date(data_inicio))
            .input('data_fim', mssql_1.default.DateTime, new Date(data_fim))
            .input('evento_id', mssql_1.default.Int, evento_id)
            .input('categoria_id', mssql_1.default.Int, categoria_id)
            .input('status', mssql_1.default.VarChar, 'pendente')
            .input('lance_atual', mssql_1.default.Decimal(18, 2), null)
            .input('qtd_lances', mssql_1.default.Int, 0)
            .input('comissao', mssql_1.default.Decimal(10, 2), parseFloat(comissao))
            .query(`
        INSERT INTO lotes 
        (nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id, status, lance_atual, qtd_lances, comissao)
        OUTPUT INSERTED.id
        VALUES 
        (@nome, @descricao, @lance_minimo, @data_inicio, @data_fim, @evento_id, @categoria_id, @status, @lance_atual, @qtd_lances, @comissao)
      `);
        res.status(201).json({ mensagem: 'Lote criado com sucesso', id: result.recordset[0].id });
    }
    catch (error) {
        console.error('Erro ao criar lote:', error);
        res.status(500).json({ mensagem: 'Erro ao criar lote' });
    }
}
async function updateLote(req, res) {
    const { id } = req.params;
    const { nome, descricao, lance_minimo, data_inicio, data_fim, evento_id, categoria_id, comissao } = req.body;
    const imagens = req.files && Array.isArray(req.files) ? req.files : [];
    try {
        const conn = await db_1.default;
        await conn.request()
            .input('id', Number(id))
            .input('nome', nome)
            .input('descricao', descricao || null)
            .input('lance_minimo', mssql_1.default.Decimal(18, 2), parseFloat(lance_minimo))
            .input('data_inicio', new Date(data_inicio))
            .input('data_fim', new Date(data_fim))
            .input('evento_id', evento_id)
            .input('categoria_id', categoria_id)
            .input('comissao', mssql_1.default.Decimal(10, 2), parseFloat(comissao))
            .query(`
        UPDATE lotes
        SET nome = @nome,
            descricao = @descricao,
            lance_minimo = @lance_minimo,
            data_inicio = @data_inicio,
            data_fim = @data_fim,
            evento_id = @evento_id,
            categoria_id = @categoria_id,
            comissao = @comissao
        WHERE id = @id
      `);
        await conn.request()
            .input('lote_id', Number(id))
            .query(`DELETE FROM lote_imagens WHERE lote_id = @lote_id`);
        for (const file of imagens) {
            const imageUrl = `/uploads/${file.filename}`;
            await conn.request()
                .input('lote_id', Number(id))
                .input('url', imageUrl)
                .query(`INSERT INTO lote_imagens (lote_id, url) VALUES (@lote_id, @url)`);
        }
        res.status(200).json({ mensagem: 'Lote atualizado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao atualizar lote:', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar lote' });
    }
}
async function deleteLote(req, res) {
    const { id } = req.params;
    try {
        await (await db_1.default).request()
            .input('id', mssql_1.default.Int, Number(id))
            .query('DELETE FROM lotes WHERE id = @id');
        res.status(200).json({ mensagem: 'Lote deletado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar lote:', error);
        res.status(500).json({ mensagem: 'Erro ao deletar lote' });
    }
}
