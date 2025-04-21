"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lotesController_1 = require("../controllers/lotesController");
const router = (0, express_1.Router)();
// GET: listar todos os lotes
router.get('/', lotesController_1.getLotes);
// GET: buscar um lote específico por ID
router.get('/:id', lotesController_1.getLote);
// POST: criar um novo lote
router.post('/', lotesController_1.createLote);
// PUT: atualizar um lote existente
router.put('/:id', lotesController_1.updateLote);
// DELETE: remover um lote
router.delete('/:id', lotesController_1.deleteLote);
exports.default = router;
