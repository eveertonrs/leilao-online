"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lancesController_1 = require("../controllers/lancesController");
const router = (0, express_1.Router)();
router.get('/', lancesController_1.getLances);
router.post('/', lancesController_1.createLance);
exports.default = router;
