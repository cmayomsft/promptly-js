import { BotContext, Promiseable } from 'botbuilder';
export declare abstract class Topic<BTC extends BotContext, S, V = any> {
    constructor(state: S);
    private _state;
    state: S;
    abstract onReceive(context: BTC): Promiseable<any>;
    protected _onSuccess?: (context: BTC, value: V) => void;
    onSuccess(success: (context: BTC, value: V) => void): this;
    protected _onFailure?: (context: BTC, reason: string) => void;
    onFailure(failure: (context: BTC, reason: string) => void): this;
}
