"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/eventosRoutes.ts
const express_1 = require("express");
const eventosController_1 = require("../controllers/eventosController");
const router = (0, express_1.Router)();
router.get('/', eventosController_1.getEventos);
router.get('/:id', eventosController_1.getEvento);
router.post('/', eventosController_1.createEvento);
router.put('/:id', eventosController_1.updateEvento);
router.delete('/:id', eventosController_1.deleteEvento);
exports.default = router;
