import { Topic } from './topic';

export interface ActiveTopicState {
    name: string;
    state?: any;
}

export interface ParentTopicState {
    activeTopic?: ActiveTopicState;
}

declare global {
    export interface ConversationState {
        rootParentTopic?: ParentTopicState;
    }
}

export abstract class ParentTopic<S extends ParentTopicState> extends Topic<S> {
    // TODO: Refactor and type.
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
        // START HERE: State is getting set here, but never passed back to rootTopic in app.ts.
        this.state.activeTopic = { name: topic.constructor.name, state: topic.state };
    }
    protected get activeTopic(): Topic {
        return this._activeTopic;
    }
}