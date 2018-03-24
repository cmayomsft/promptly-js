import { BotContext, UserState, ConversationState } from 'botbuilder';
import { ConversationTopic, ConversationTopicState } from './conversationTopic';

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
export abstract class TopicsRoot<BUS, BCS extends TopicsRootState> extends ConversationTopic<BUS, BCS, ConversationTopicState> {
    public constructor(context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>) {
        
        if (!conversationState.get(context).rootTopic) {
            // Initialize root ConversationTopic state and persist it to conversatin state
            //  to establish the root of all state in the model.
            conversationState.get(context).rootTopic = { 
                activeTopic: undefined
            };
        }

        // Note: This is a subtle, but powerful, aspect of the library. By rooting the TopicsRoot
        //  state in conversation state this way and using that state by reference to all 
        //  subsequent Topics, each Topic's state is persisted automatically (without having to write
        //  state management code).
        super(conversationState.get(context).rootTopic, userState, conversationState);
    }
}