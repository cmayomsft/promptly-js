import { ParentTopic, ParentTopicState } from './parentTopic';

export interface RootTopicState<S> {
    state?: S;
}

declare global {
    export interface ConversationState {
        rootTopic?: RootTopicState<ParentTopicState>;
    }
}

export abstract class TopicRoot extends ParentTopic<ParentTopicState> {
    public constructor(context: BotContext) {
        // Initialize the root topic state and pass that reference to root topic to facilitate the state 
        //  reference chain to context.state.conversation.
        if (!context.state.conversation.rootTopic) {
            context.state.conversation.rootTopic = { 
                state: { activeTopic: undefined } 
            };
        }

        super(context.state.conversation.rootTopic.state);
    }
}