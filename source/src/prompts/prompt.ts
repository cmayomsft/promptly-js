import { Promiseable, TurnContext, Activity, ResourceResponse } from 'botbuilder';
import { Topic } from "../topics/topic";
import { Validator } from "../validators/validator";

// PromptState - Used to persist state required to recreate the Prompt between turns. 
export interface PromptState {
    // turns - The current turn count. 0 is the inital turn, >0 is subsequent turns.
    turns?: number;
}

// Prompt - Specialized Topic for following the common prompt pattern without the need
//  to create a specific class.
//  Value - When the Prompt completes successfully, the value that is passed to onSuccess()
//      for the calling ConversationTopic to do something with.
export class Prompt<BotTurnContext extends TurnContext, Value> 
    extends Topic<BotTurnContext, PromptState, Value> {
    
    constructor(state: PromptState = { turns: undefined }) {
        super(state);
    }

    // onPrompt - Function to call on each turn to construct the prompt to the user.
    //  context - The context (request, response,etc.) of the current turn.
    //  lastTurnReason - The reason the last message from the last turn failed validation.
    protected _onPrompt?: (context: BotTurnContext, lastTurnReason?: string) => Promise<any> = 
        (context, lastTurnReason) => { 
            return Promise.resolve(); 
        };

    public onPrompt(...promptStrings: string[]) : this;
    // Note: Defining promptActivities as Partial<Activity>[] throws off the typing of promptCallBack, so removing Partial.
    //  Will file a bug to have Activity defined with proper required/optional parameters to remove need for Partial.
    public onPrompt(...promptActivities: Activity[]) : this;
    public onPrompt(promptCallBack: (context: BotTurnContext, lastTurnReason?: string) => Promise<any>) : this;
    public onPrompt(...args: any[]) : this {

        if (typeof args[0] === "function") {
            this._onPrompt = args[0];
        }
        else {
            let activities: Partial<Activity>[] = [];

            if (typeof args[0] === "string") {
                activities = args.map(a => { return { type: 'message', text: a }});
            }
            else {
                activities = args;
            }

            this._onPrompt = (context, lastTurnReason) => {
                return context.sendActivities(activities);
            }
        }

        return this;
    }

    // maxTurns - The maximum number of turns that the Prompt will re-prompt after failing
    //  validation before failing the Prompt. 
    protected _maxTurns: number = Number.MAX_SAFE_INTEGER;
    public maxTurns(maxTurns: number) {
        this._maxTurns = maxTurns;
        return this;
    }

    // validator - The Validator used to validate/parse the value V from the message 
    //  on the current turn.
    protected _validator?: Validator<BotTurnContext, Value>;
    public validator(validator: Validator<BotTurnContext, Value>) {
        this._validator = validator;
        return this;
    }

    // onReceive - Used to implement the common prompt pattern using the
    //  properties of Prompt.
    public onReceiveActivity(context: BotTurnContext) {
        
        // If this is the initial turn (turn 0), send the initial prompt.
        if(this.state.turns === undefined) {
            this.state.turns = 0;
            return this._onPrompt!(context);
        }

        // For all subsequent turns...

        // Validate the message/reply from the last turn.
        const validationResult = this._validator!.validate(context);

        // If the message/reply wasn't a valid response to the prompt...
        if(validationResult.reason !== undefined) {
            // Increase the turn count.
            this.state.turns += 1;

            // If max turns has been reached, the prompt has failed with too many attempts.
            if(this.state.turns === this._maxTurns) {
                validationResult.reason = 'toomanyattempts';
    
                return this._onFailure!(context, validationResult.reason);
            }

            // Re-prompt, providing the validation reason from last turn.
            return this._onPrompt!(context, validationResult.reason);
        }
        
        // Prompt was successful, so pass value (result) of the Prompt.
        return this._onSuccess!(context, validationResult.value!);
    }
}