"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
// Carregar variáveis de ambiente do arquivo .env
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json()); // Para poder receber JSON nas requisições
// Definir uma rota simples
app.get('/', function (req, res) {
    res.send('API de Leilão está funcionando!');
});
// Iniciar o servidor na porta configurada
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Servidor rodando na porta ".concat(port));
});
