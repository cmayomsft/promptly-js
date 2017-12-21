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
    protected setActiveTopic(childTopic: Topic) {
        this._activeTopic = childTopic;
        this.state.activeTopic = { name: childTopic.constructor.name, state: childTopic.state } as ActiveTopicState;
    }
    protected get activeTopic(): Topic {
        return this._activeTopic;
    }
}