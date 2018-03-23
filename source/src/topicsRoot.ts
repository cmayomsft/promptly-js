import { ConversationTopic, ConversationTopicState } from './conversationTopic';
import { BotContext } from 'botbuilder';

// TopicsRootState - Used to persist state required to recreate the TopicsRoot 
//  between turns. 
export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}

export interface PromptlyBotTurnContext extends BotContext {
    conversationState: TopicsRootState;
}

// TopicsRoot - A specialized ConversationTopic used to anchor a Topics based conversation model
//  in state.
export abstract class TopicsRoot<BTC extends PromptlyBotTurnContext, CS extends TopicsRootState> extends ConversationTopic<BTC, ConversationTopicState> {
    public constructor(context: BTC) {
        
        if (!context.conversationState.rootTopic) {
            // Initialize root ConversationTopic state and persist it to conversatin state
            //  to establish the root of all state in the model.
            context.conversationState.rootTopic = { 
                activeTopic: undefined
            };
        }

        // Note: This is a subtle, but powerful, aspect of the library. By rooting the TopicsRoot
        //  state in conversation state this way and using that state by reference to all 
        //  subsequent Topics, each Topic's state is persisted automatically (without having to write
        //  state management code).
        super(context.conversationState.rootTopic);
    }
}