"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imagensController_1 = require("../controllers/imagensController");
const router = (0, express_1.Router)();
router.get('/:lote_id', imagensController_1.getImagensPorLote); // imagens de um lote específico
router.post('/', imagensController_1.createImagem); // adicionar nova imagem
exports.default = router;
