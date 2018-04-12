"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_1 = require("./prompt");
const textValidator_1 = require("../validators/textValidator");
class TextPrompt extends prompt_1.Prompt {
    constructor() {
        super();
        this._validator = new textValidator_1.TextValidator();
    }
}
exports.TextPrompt = TextPrompt;
//# sourceMappingURL=textPrompt.js.map