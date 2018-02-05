import { ConversationTopic, ConversationTopicState } from './conversationTopic';

// TopicsRootState - Used to persist state required to recreate the TopicsRoot 
//  between turns. 
export interface TopicsRootState<S extends ConversationTopicState> {
    // S - The state of the ConvsationTopic that serves as the root for 
    //  all Topics in the conversation model. 
    state?: S;
}

declare global {
    export interface ConversationState {
        topicsRoot?: TopicsRootState<ConversationTopicState>;
    }
}

// TopicsRoot - A specialized ConversationTopic used to anchor a Topics based conversation model
//  in state.
export abstract class TopicsRoot extends ConversationTopic<ConversationTopicState> {
    public constructor(context: BotContext) {

        if (!context.state.conversation.topicsRoot) {
            // Initialize root ConversationTopic state and persist it to conversatin state
            //  to establish the root of all state in the model.
            context.state.conversation.topicsRoot = { 
                state: { activeTopic: undefined } 
            };
        }

        // Note: This is a subtle, but powerful, aspect of the library. By rooting the TopicsRoot
        //  state in conversation state this way and using that state by reference to all 
        //  subsequent Topics, each Topic's state is persisted automatically (without having to write
        //  state management code).
        super(context.state.conversation.topicsRoot.state);
    }
}