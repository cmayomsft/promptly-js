import { ParentTopic, ParentTopicState } from './parentTopic';

export interface TopicsRootState<S> {
    state?: S;
}

declare global {
    export interface ConversationState {
        topicsRoot?: TopicsRootState<ParentTopicState>;
    }
}

export abstract class TopicsRoot extends ParentTopic<ParentTopicState> {
    public constructor(context: BotContext) {
        // Initialize the root topic state and pass that reference to root topic to facilitate the state 
        //  reference chain to context.state.conversation.
        if (!context.state.conversation.topicsRoot) {
            context.state.conversation.topicsRoot = { 
                state: { activeTopic: undefined } 
            };
        }

        super(context.state.conversation.topicsRoot.state);
    }
}