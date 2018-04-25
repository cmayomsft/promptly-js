"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("../topics/topic");
// Prompt - Specialized Topic for following the common prompt pattern without the need
//  to create a specific class.
//  Value - When the Prompt completes successfully, the value that is passed to onSuccess()
//      for the calling ConversationTopic to do something with.
class Prompt extends topic_1.Topic {
    constructor(state = { turns: undefined }) {
        super(state);
        // onPrompt - Function to call on each turn to construct the prompt to the user.
        //  context - The context (request, response,etc.) of the current turn.
        //  lastTurnReason - The reason the last message from the last turn failed validation.
        this._onPrompt = (context, lastTurnReason) => { };
        // maxTurns - The maximum number of turns that the Prompt will re-prompt after failing
        //  validation before failing the Prompt. 
        this._maxTurns = Number.MAX_SAFE_INTEGER;
        return this;
    }
    onPrompt(...args) {
        if (typeof args[0] === "function") {
            this._onPrompt = args[0];
        }
        else {
            this._onPrompt = (context, lastTurnReason) => {
                return context.sendActivity(...args);
            };
        }
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
    // onReceive - Used to implement the common prompt pattern using the
    //  properties of Prompt.
    onReceiveActivity(context) {
        // If this is the initial turn (turn 0), send the initial prompt.
        if (this.state.turns === undefined) {
            this.state.turns = 0;
            return this._onPrompt(context, undefined);
        }
        // For all subsequent turns...
        // Validate the message/reply from the last turn.
        const validationResult = this._validator.validate(context);
        // If the message/reply wasn't a valid response to the prompt...
        if (validationResult.reason !== undefined) {
            // Increase the turn count.
            this.state.turns += 1;
            // If max turns has been reached, the prompt has failed with too many attempts.
            if (this.state.turns === this._maxTurns) {
                validationResult.reason = 'toomanyattempts';
                return this._onFailure(context, validationResult.reason);
            }
            // Re-prompt, providing the validation reason from last turn.
            return this._onPrompt(context, validationResult.reason);
        }
        // Prompt was successful, so pass value (result) of the Prompt.
        return this._onSuccess(context, validationResult.value);
    }
}
exports.Prompt = Prompt;
//# sourceMappingURL=prompt.js.map