"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsuarios = getUsuarios;
exports.getUsuario = getUsuario;
exports.createUsuario = createUsuario;
exports.updateUsuario = updateUsuario;
exports.deleteUsuario = deleteUsuario;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tiposValidos = ['admin', 'usuario'];
async function getUsuarios(req, res) {
    try {
        const result = await (await db_1.default).request().query(`
      SELECT id, nome, email, tipo, data_cadastro FROM usuarios
    `);
        res.status(200).json(result.recordset);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
    }
}
async function getUsuario(req, res) {
    const { id } = req.params;
    try {
        const result = await (await db_1.default).request()
            .input('id', Number(id))
            .query(`
        SELECT id, nome, email, tipo, data_cadastro 
        FROM usuarios WHERE id = @id
      `);
        if (result.recordset.length === 0) {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(result.recordset[0]);
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
}
async function createUsuario(req, res) {
    const { nome, email, senha, tipo } = req.body;
    if (!nome || !email || !senha) {
        res.status(400).json({ mensagem: 'Campos obrigatórios: nome, email, senha' });
        return;
    }
    const tipoFinal = tipo || 'usuario';
    if (!tiposValidos.includes(tipoFinal)) {
        res.status(400).json({ mensagem: 'Tipo de usuário inválido. Use "admin" ou "usuario".' });
        return;
    }
    try {
        const senha_hash = await bcryptjs_1.default.hash(senha, 10);
        await (await db_1.default).request()
            .input('nome', nome)
            .input('email', email)
            .input('senha_hash', senha_hash)
            .input('tipo', tipoFinal)
            .query(`
        INSERT INTO usuarios (nome, email, senha_hash, tipo, data_cadastro)
        VALUES (@nome, @email, @senha_hash, @tipo, GETDATE())
      `);
        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar usuário', detalhe: error.message });
    }
}
async function updateUsuario(req, res) {
    const { id } = req.params;
    const { nome, email, senha, tipo } = req.body;
    if (tipo && !tiposValidos.includes(tipo)) {
        res.status(400).json({ mensagem: 'Tipo de usuário inválido. Use "admin" ou "usuario".' });
        return;
    }
    try {
        const request = (await db_1.default).request()
            .input('id', Number(id))
            .input('nome', nome)
            .input('email', email);
        if (tipo) {
            request.input('tipo', tipo);
        }
        if (senha) {
            const senha_hash = await bcryptjs_1.default.hash(senha, 10);
            request.input('senha_hash', senha_hash);
        }
        await request.query(`
      UPDATE usuarios
      SET nome = @nome,
          email = @email
          ${tipo ? ', tipo = @tipo' : ''}
          ${senha ? ', senha_hash = @senha_hash' : ''}
      WHERE id = @id
    `);
        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
}
async function deleteUsuario(req, res) {
    const { id } = req.params;
    try {
        await (await db_1.default).request()
            .input('id', Number(id))
            .query('DELETE FROM usuarios WHERE id = @id');
        res.status(200).json({ mensagem: 'Usuário deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
}
