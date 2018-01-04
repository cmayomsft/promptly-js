import { Promiseable } from 'botbuilder-core';

export abstract class Topic<S = any> {
    
    private _name: string;
    public get name(): string {
        return this._name;
    }

    constructor(name: string, state: S) {
        this._name = name;
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
    protected _onFailure?: (context: BotContext, failureReason: string) => void;
    public onFailure(failure: (context: BotContext, failureReason: string) => void) {
        this._onFailure = failure;
        return this;
    }

    abstract onReceive(context: BotContext): Promiseable<any>;
}