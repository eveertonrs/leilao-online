"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriasController_1 = require("../controllers/categoriasController");
const router = (0, express_1.Router)();
router.get('/', categoriasController_1.getCategorias); // Buscar todas as categorias
router.get('/:id', categoriasController_1.getCategoria); // Buscar uma categoria por ID
router.post('/', categoriasController_1.createCategoria); // Criar nova categoria
router.put('/:id', categoriasController_1.updateCategoria); // Atualizar categoria
router.delete('/:id', categoriasController_1.deleteCategoria); // Deletar categoria
exports.default = router;
