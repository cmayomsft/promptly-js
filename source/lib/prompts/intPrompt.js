"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_1 = require("./prompt");
const intValidator_1 = require("../validators/intValidator");
class IntPrompt extends prompt_1.Prompt {
    constructor() {
        super();
        this._validator = new intValidator_1.IntValidator();
    }
}
exports.IntPrompt = IntPrompt;
//# sourceMappingURL=intPrompt.js.map