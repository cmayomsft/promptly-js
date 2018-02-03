"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("./topic");
class Prompt extends topic_1.Topic {
    constructor(state = { turns: undefined }) {
        super(state);
        // Max Turns
        this._maxTurns = 2;
        return this;
    }
    onPrompt(prompt) {
        this._onPrompt = prompt;
        return this;
    }
    maxTurns(maxTurns) {
        this._maxTurns = maxTurns;
        return this;
    }
    validator(validator) {
        this._validator = validator;
        return this;
    }
    // onReceive
    onReceive(context) {
        // If this is the first turn, send the initial prompt.
        if (this.state.turns === undefined) {
            // Set/increase the turn count.
            this.state.turns = 0;
            return this._onPrompt(context, undefined);
        }
        // For all subsequent turns...
        // Validate the response from the last prompt.
        const validationResult = this._validator.validate(context);
        // If the response wasn't a valid response to the prompt...
        if (validationResult.reason !== undefined) {
            // Increase the turn count.
            this.state.turns += 1;
            // If max turns has been reached, the prompt has failed with too many attempts.
            if (this.state.turns === this._maxTurns) {
                validationResult.reason = 'toomanyattempts';
                return this._onFailure(context, validationResult.reason);
            }
            // Prompt using validation reason from last turn.
            return this._onPrompt(context, validationResult.reason);
        }
        // Prompt was successful, so call code to process value and clean up.
        return this._onSuccess(context, validationResult.value);
    }
}
exports.Prompt = Prompt;
//# sourceMappingURL=prompt.js.map