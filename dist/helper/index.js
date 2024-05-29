"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = exports.apiResponse = void 0;
const apiResponse = (code, message, data) => {
    const response = {
        meta: {
            code,
            message
        },
        data
    };
    return response;
};
exports.apiResponse = apiResponse;
const formatZodError = (error) => {
    const { issues } = error;
    const convertedErrorExpected = {};
    issues.map((issue) => {
        const { path, message } = issue;
        const key = path.join('.');
        if (convertedErrorExpected[key]) {
            convertedErrorExpected[key].push(message);
        }
        else {
            convertedErrorExpected[key] = [message];
        }
    });
    return { errors: convertedErrorExpected };
};
exports.formatZodError = formatZodError;
//# sourceMappingURL=index.js.map