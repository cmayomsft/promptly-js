import { Topic } from './topic';

export interface ActiveTopicState {
    name: string;
    // State must by any (vs. generic) becuase child topic state will vary amoung all the possible active topics
    //  for a ParentTopic.
    state?: any;
}

export interface ParentTopicState {
    activeTopic?: ActiveTopicState;
}

export abstract class ParentTopic<S extends ParentTopicState, V = any> extends Topic<S, V> {

    private _subTopics = new Map<string, (any?) => Topic<any>>();
    protected get subTopics(): Map<string, (any?) => Topic<any>> {
        return this._subTopics;
    }

    private _activeTopic: Topic<any>;
    public get activeTopic(): Topic<any> {
        // If there is no active topic state, there is no active child topic being managed.
        if(!this.state.activeTopic) {
            return undefined;
        } 
        
        // If there is an active child topic object reference, return that.
        if(this._activeTopic) {
            return this._activeTopic;
        }

        // TODO: This should be constructing the Topic w/ it's state rather than requiring state property.
        this._activeTopic = this.subTopics.get(this.state.activeTopic.name)();
        this._activeTopic.state = this.state.activeTopic.state;

        return this._activeTopic;
    }

    public setActiveTopic(subTopicKey: string, ...args) {
        if(args.length > 0) {
            this._activeTopic = this.subTopics.get(subTopicKey)(...args);;
        } else {
            this._activeTopic = this.subTopics.get(subTopicKey)();;
        }

        this.state.activeTopic = { name: subTopicKey, state: this._activeTopic.state };

        return this._activeTopic;
    }

    public get hasActiveTopic(): boolean {
        return this.state.activeTopic !== undefined;
    }

    public clearActiveTopic() {
        this.state.activeTopic = undefined;
    }
}