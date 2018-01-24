import { Promiseable } from 'botbuilder-core';

import { Topic } from "./topic";
import { Validator } from "../validator/validator";

export interface PromptState {
    turns?: number;
}

export class Prompt<V> extends Topic<PromptState, V> {
    
    constructor(name: string, state: PromptState = { turns: undefined }) {
        super(name, state);
        return this;
    }

    // onPrompt
    protected _onPrompt?: (context: BotContext, lastTurnReason: string) => void;
    public onPrompt(prompt: (context: BotContext, lastTurnReason: string) => void) {
        this._onPrompt = prompt;
        return this;
    }

    // Max Turns
    protected _maxTurns: number = 2;
    public maxTurns(maxTurns: number) {
        this._maxTurns = maxTurns;
        return this;
    }

    // validator
    protected _validator: Validator<V>;
    public validator(validator: Validator<V>) {
        this._validator = validator;
        return this;
    }

    // onSuccess
    protected _onSuccess?: (context: BotContext, value: V) => void;
    public onSuccess(success: (context: BotContext, value: V) => void) {
        this._onSuccess = success;
        return this;
    }

    // onFailure
    protected _onFailure?: (context: BotContext, reason: string) => void;
    public onFailure(failure: (context: BotContext, reason: string) => void) {
        this._onFailure = failure;
        return this;
    }

    // onReceive
    public onReceive(context: BotContext) {
        
        // If this is the first turn, send the initial prompt.
        if(this.state.turns === undefined) {
            // Set/increase the turn count.
            this.state.turns = 0;
            return this._onPrompt(context, undefined);
        }

        // For all subsequent turns...

        // Validate the response from the last prompt.
        const validationResult = this._validator.validate(context);

        // If the response wasn't a valid response to the prompt...
        if(validationResult.reason !== undefined) {
            // Increase the turn count.
            this.state.turns += 1;

            // If max turns has been reached, the prompt has failed with too many attempts.
            if(this.state.turns === this._maxTurns) {
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