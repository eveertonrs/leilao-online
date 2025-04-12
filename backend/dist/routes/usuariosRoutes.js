"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/usuariosRoutes.ts
const express_1 = require("express");
const usuariosController_1 = require("../controllers/usuariosController");
const router = (0, express_1.Router)();
router.get('/', usuariosController_1.getUsuarios);
router.get('/:id', usuariosController_1.getUsuario);
router.post('/', usuariosController_1.createUsuario);
router.put('/:id', usuariosController_1.updateUsuario);
router.delete('/:id', usuariosController_1.deleteUsuario);
console.log('🔁 Rotas de usuários carregadas');
exports.default = router;
