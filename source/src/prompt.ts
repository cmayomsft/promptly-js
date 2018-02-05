import { Promiseable } from 'botbuilder';
import { Topic } from "./topic";
import { Validator } from "./validator/validator";

// PromptState - Used to persist state required to recreate the Prompt between turns. 
export interface PromptState {
    // turns - The current turn count. 0 is the inital turn, >0 is subsequent turns.
    turns?: number;
}

// Prompt - Specialized Topic for following the common prompt pattern without the need
//  to create a specific class.
//  V - When the Prompt completes successfully, the value that is passed to onSuccess()
//      for the calling ConversationTopic to do something with.
export class Prompt<V> extends Topic<PromptState, V> {
    
    constructor(state: PromptState = { turns: undefined }) {
        super(state);
        return this;
    }

    // onPrompt - Function to call on each turn to construct the prompt to the user.
    //  context - The context (request, response,etc.) of the current turn.
    //  lastTurnReason - The reason the last message from the last turn failed validation.
    protected _onPrompt?: (context: BotContext, lastTurnReason: string) => void;
    public onPrompt(prompt: (context: BotContext, lastTurnReason: string) => void) {
        this._onPrompt = prompt;
        return this;
    }

    // maxTurns - The maximum number of turns that the Prompt will re-prompt after failing
    //  validation before failing the Prompt. 
    protected _maxTurns: number = 2;
    public maxTurns(maxTurns: number) {
        this._maxTurns = maxTurns;
        return this;
    }

    // validator - The Validator used to validate/parse the value V from the message 
    //  on the current turn.
    protected _validator: Validator<V>;
    public validator(validator: Validator<V>) {
        this._validator = validator;
        return this;
    }

    // onReceive - Used to implement the common prompt pattern using the
    //  properties of Prompt.
    public onReceive(context: BotContext) {
        
        // If this is the initial turn (turn 0), send the initial prompt.
        if(this.state.turns === undefined) {
            this.state.turns = 0;
            return this._onPrompt(context, undefined);
        }

        // For all subsequent turns...

        // Validate the message/reply from the last turn.
        const validationResult = this._validator.validate(context);

        // If the message/reply wasn't a valid response to the prompt...
        if(validationResult.reason !== undefined) {
            // Increase the turn count.
            this.state.turns += 1;

            // If max turns has been reached, the prompt has failed with too many attempts.
            if(this.state.turns === this._maxTurns) {
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