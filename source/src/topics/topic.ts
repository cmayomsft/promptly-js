import { BotContext, Promiseable } from 'botbuilder';

// Topic - Abstract base class for modeling a topic of conversation.
//  State = Interface for the state of the Topic, used to manage the Topic on each turn, 
//      or call to onReceive().
//  Value = Interface for the resulting value for when the Topic completes successfully.
//      Optional for cases where the Topic doesn't need to return a value. 
export abstract class Topic<BotTurnContext extends BotContext, State, Value = any> {

    constructor(state: State) {
        this._state = state;
        return this;
    }

    // state - Property to get state of Topic for persisting between turns.
    private _state: State;
    public get state(): State {
        return this._state;
    }
    public set state(state: State) {
        this._state = state;
    }

    // onReceiveActivity - Called on each turn when Topic is the active topic of conversation.
    abstract onReceiveActivity(context: BotTurnContext): Promiseable<any>;

    // onSuccess - Function to call when the Topic completes successfully, passing the
    //  resulting value of the Topic.
    protected _onSuccess?: (context: BotTurnContext, value: Value) => void = () => {};
    public onSuccess(success: (context: BotTurnContext, value: Value) => void) {
        this._onSuccess = success;
        return this;
    }

    // onFailure - Function to call when the Topic ends unsuccessfully, passing the reason
    //  why the Topic failed. 
    protected _onFailure?: (context: BotTurnContext, reason: string) => void = () => {};
    public onFailure(failure: (context: BotTurnContext, reason: string) => void) {
        this._onFailure = failure;
        return this;
    }
}