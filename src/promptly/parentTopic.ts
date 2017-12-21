import { Topic } from './topic';

export interface ActiveTopicState {
    name: string;
    // state must by any (vs. generic) becuase child topic state will vary.
    state?: any;
}

export interface ParentTopicState {
    activeTopic?: ActiveTopicState;
}

export abstract class ParentTopic<S extends ParentTopicState> extends Topic<S> {
    // TODO: Refactor to create topic instace from the name of the class.
    private _childTopics: any;
    protected get childTopics(): any {
        return this._childTopics;
    }
    protected set childTopics(topics: any) {
        this._childTopics = topics;
    }

    private _activeTopic: Topic;
    public get activeTopic(): Topic {
        // If there is no active topic state, there is no active child topic being managed.
        if(!this.state.activeTopic) {
            return undefined;
        } 
        
        // If there is an active child topic object reference, return that.
        if(this._activeTopic) {
            return this._activeTopic;
        }

        // Create the active child topic object reference and return that.
        this._activeTopic = new this.childTopics[this.state.activeTopic.name](this.state.activeTopic.state);
        return this._activeTopic;
    }
    public set activeTopic(childTopic: Topic) {
        this._activeTopic = childTopic;
        this.state.activeTopic = { name: childTopic.constructor.name, state: childTopic.state } as ActiveTopicState;
    }

    public get hasActiveTopic(): boolean {
        return this.state.activeTopic !== undefined;
    }
}