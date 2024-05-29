"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.signup = void 0;
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const helper_1 = require("../../helper");
const bad_request_1 = require("../exceptions/bad-request");
const exceptions_1 = require("../exceptions");
const users_1 = require("../schema/users");
const not_found_1 = require("../exceptions/not-found");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.SignupSchema.parse(req.body);
    const { name, email, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (user) {
        throw new bad_request_1.BadRequestException('User already exists!', exceptions_1.ErrorCodes.USER_ALREADY_EXISTS, null);
    }
    user = yield __1.prismaClient.user.create({
        data: {
            name,
            email,
            password: (0, bcrypt_1.hashSync)(password, 10)
        }
    });
    return res.status(201).json((0, helper_1.apiResponse)(201, 'User created successfully', user));
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        throw new not_found_1.NotFoundException('User not found!', exceptions_1.ErrorCodes.USER_NOT_FOUND);
    }
    if (!(0, bcrypt_1.compareSync)(password, user.password)) {
        throw new bad_request_1.BadRequestException('Invalid Credential!', exceptions_1.ErrorCodes.INCORRECT_PASSWORD, null);
    }
    const token = jwt.sign({
        userId: user.id,
    }, secrets_1.JWT_SECRET);
    const response = {
        user,
        token
    };
    return res.status(200).json((0, helper_1.apiResponse)(200, 'Login successful', response));
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json((0, helper_1.apiResponse)(200, 'User found', req.user));
});
exports.me = me;
//# sourceMappingURL=auth.js.map