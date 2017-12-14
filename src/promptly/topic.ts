import { Promiseable } from 'botbuilder-core';

export abstract class Topic<S = any> {
    
    private _state: S;
    public get state(): S {
        return this._state;
    }
    
    constructor(state: S) {
        this._state = state;
    }

    abstract onReceive(context: BotContext): Promiseable<any>;
}