import { Promiseable } from 'botbuilder-core';

declare global {
    export interface ConversationState {
        activeTopic?: ActiveTopicState;
    }
}

export interface ActiveTopicState {
    name: string;
    state?: any;
}

export abstract class Topic<S = any> {
    
    private _state: S;
    public get state(): S {
        return this._state;
    }
    protected abstract getDefaultState(): S;
    
    constructor(state?: S) {
        this._state = (!state) ? this.getDefaultState() : state;
    }

    abstract onReceive(context: BotContext): Promiseable<any>;
}