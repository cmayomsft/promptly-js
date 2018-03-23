import { BotContext } from 'botbuilder';
import { ConversationTopic, ConversationTopicState } from './conversationTopic';

// TopicsRootState - Used to persist state required to recreate the TopicsRoot 
//  between turns. 
export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}

// Consumer needs to tell me what type of context it uses.
// That context needs to have:
//  context.conversationState
//  context.conversationState.rootTopic
// 
// The rest of the classes just use their internal state.

// Pass the context as generic.
// Restrict that context to have context.conversationState.rootTopic of type ConversationTopicState.

// I need to take a special kind of context.

export interface BotStateContext<BotConversationState extends TopicsRootState> extends BotContext {
    conversationState: BotConversationState;
}

// TopicsRoot - A specialized ConversationTopic used to anchor a Topics based conversation model
//  in state.
export abstract class TopicsRoot<CS extends TopicsRootState> extends ConversationTopic<ConversationTopicState> {
    public constructor(context: BotStateContext<CS>) {
        
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