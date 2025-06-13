"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ============================
// backend/src/routes/lancesRoutes.ts
// ============================
const express_1 = require("express");
const lancesController_1 = require("../controllers/lancesController");
const router = (0, express_1.Router)();
router.get('/lote/:loteId', lancesController_1.getLancesPorLote);
router.get('/lances', lancesController_1.getLances);
router.post('/lance', lancesController_1.createLance);
router.get('/maior-lance/:loteId', lancesController_1.getMaiorLance);
exports.default = router;
