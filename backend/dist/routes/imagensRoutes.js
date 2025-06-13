"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/imagensRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)(multerConfig_1.default);
router.post('/', upload.single('imagem'), (req, res) => {
    res.json({ path: req.file?.filename });
});
exports.default = router;
