import { Topic } from './topic';

export interface ActiveTopicState {
    name: string;
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
    protected setActiveTopic(context: BotContext, topic: Topic) {
        // TODO: Context will be removed when Prompts is managing their own state. Make this a property.
        context.state.conversation.promptName = undefined;

        this._activeTopic = topic;
        this.state.activeTopic = { name: topic.constructor.name, state: topic.state } as ActiveTopicState;
    }
    protected get activeTopic(): Topic {
        return this._activeTopic;
    }
}