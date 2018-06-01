"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../validators/validator");
class TextValidator extends validator_1.Validator {
    validate(context) {
        if ((context.activity.text) && (context.activity.text.length > 0)) {
            return { value: context.activity.text };
        }
        else {
            return { reason: "nottext" };
        }
    }
}
exports.TextValidator = TextValidator;
//# sourceMappingURL=textValidator.js.map