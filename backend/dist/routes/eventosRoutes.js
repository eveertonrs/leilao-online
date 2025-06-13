"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = __importDefault(require("../config/upload"));
const express_1 = require("express");
const eventosController_1 = require("../controllers/eventosController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // ✅ Autenticação básica
const autenticarAdmin_1 = require("../middleware/autenticarAdmin"); // ✅ Autorização específica para ADMIN
const router = (0, express_1.Router)();
// ⬅️ Rotas públicas (acessível por qualquer usuário logado ou não)
router.get('/', eventosController_1.getEventos);
router.get('/:id', eventosController_1.getEvento);
// ⬇️ Rotas protegidas (somente ADMIN pode criar, editar, excluir)
router.post('/', authMiddleware_1.autenticarToken, autenticarAdmin_1.autenticarAdmin, upload_1.default.single('foto_capa'), eventosController_1.createEvento);
router.put('/:id', authMiddleware_1.autenticarToken, autenticarAdmin_1.autenticarAdmin, upload_1.default.single('foto_capa'), eventosController_1.updateEvento);
router.delete('/:id', authMiddleware_1.autenticarToken, autenticarAdmin_1.autenticarAdmin, eventosController_1.deleteEvento);
exports.default = router;
