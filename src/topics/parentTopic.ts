import { Topic } from './topic';

// TODO: Type inforce S to at least have ActiveTopicState or derive from it.
export abstract class ParentTopic<S> extends Topic<S> {
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
        context.state.conversation.promptName = undefined;

        this._activeTopic = topic;
        context.state.conversation.activeTopic = { name: topic.constructor.name, state: topic.state };
    }
    protected get activeTopic(): Topic {
        return this._activeTopic;
    }
}