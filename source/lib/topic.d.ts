import { Promiseable } from 'botbuilder';
export declare abstract class Topic<S, V = any> {
    constructor(state: S);
    private _state;
    readonly state: S;
    abstract onReceive(context: BotContext): Promiseable<any>;
    protected _onSuccess?: (context: BotContext, value: V) => void;
    onSuccess(success: (context: BotContext, value: V) => void): this;
    protected _onFailure?: (context: BotContext, reason: string) => void;
    onFailure(failure: (context: BotContext, reason: string) => void): this;
}
