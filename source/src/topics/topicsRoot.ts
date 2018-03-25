import { ConversationTopic, ConversationTopicState } from './conversationTopic';
import { BotContext } from 'botbuilder';

// PromptlyBotConversationState - Used to define the shape of the bot's ConversationState to guarantee a place to put the 
//  root topics state.
export interface PromptlyBotConversationState<RootTopicState extends ConversationTopicState> {
    rootTopic?: RootTopicState;
}

// TopicsRootState - Used to persist state required to recreate the TopicsRoot 
//  between turns. 
/*export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}*/

// PromptlyBotTurnContext - Used define the shape of conversation state used in the custom BotContext for the bot.
export interface PromptlyBotTurnContext<BotConversationState extends PromptlyBotConversationState<RootTopicState>, RootTopicState extends ConversationTopicState> extends BotContext {
    conversationState: BotConversationState;
}

// TopicsRoot - A specialized ConversationTopic used to anchor a Topics based conversation model
//  in state.
export abstract class TopicsRoot<BotTurnContext extends PromptlyBotTurnContext<BotConversationState, RootTopicState>, 
        BotConversationState extends PromptlyBotConversationState<RootTopicState>, 
        RootTopicState extends ConversationTopicState> 
    extends ConversationTopic<BotTurnContext, RootTopicState> {
    
        public constructor(context: BotTurnContext) {
        
        if (!context.conversationState.rootTopic) {
            // Initialize root ConversationTopic state and persist it to conversatin state
            //  to establish the root of all state in the model.
            context.conversationState.rootTopic = <RootTopicState>{ 
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