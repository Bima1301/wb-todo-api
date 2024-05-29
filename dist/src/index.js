"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("./routes"));
const users_1 = require("./schema/users");
const errors_1 = require("./middlewares/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.prismaClient = new client_1.PrismaClient({
    log: ['query'],
}).$extends({
    query: {
        user: {
            create({ args, query }) {
                args.data = users_1.SignupSchema.parse(args.data);
                return query(args);
            }
        }
    }
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT, () => {
    console.log('Server Running on port ' + secrets_1.PORT);
});
//# sourceMappingURL=index.js.map