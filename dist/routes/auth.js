"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("./../error-handler");
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = __importDefault(require("../middlewares/auth"));
const authRoutes = (0, express_1.Router)();
authRoutes.post("/signup", (0, error_handler_1.ErrorHandler)(auth_1.signup));
authRoutes.post("/login", (0, error_handler_1.ErrorHandler)(auth_1.login));
authRoutes.get("/me", [auth_2.default], (0, error_handler_1.ErrorHandler)(auth_1.me));
exports.default = authRoutes;
//# sourceMappingURL=auth.js.map