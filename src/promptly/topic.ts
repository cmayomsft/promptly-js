import { Promiseable } from 'botbuilder-core';

export abstract class Topic<S = any> {

    constructor(state: S) {
        this._state = state;
        return this;
    }

    private _state: S;
    public get state(): S {
        return this._state;
    }
    public set state(state: S) {
        this._state = state;
    }

    // onSuccess
    protected _onSuccess?: (context: BotContext, state: S) => void;
    public onSuccess(success: (context: BotContext, state: S) => void) {
        this._onSuccess = success;
        return this;
    }

    // onFailure
    protected _onFailure?: (context: BotContext, reason: string) => void;
    public onFailure(failure: (context: BotContext, reason: string) => void) {
        this._onFailure = failure;
        return this;
    }

    abstract onReceive(context: BotContext): Promiseable<any>;
}