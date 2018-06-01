"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../validators/validator");
class IntValidator extends validator_1.Validator {
    validate(context) {
        if ((context.activity.text) && (!Number.isNaN(parseInt(context.activity.text)))) {
            return { value: parseInt(context.activity.text) };
        }
        else {
            return { reason: "notint" };
        }
    }
}
exports.IntValidator = IntValidator;
//# sourceMappingURL=intValidator.js.map