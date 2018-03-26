import { ConversationTopic, ConversationTopicState } from './conversationTopic';
import { BotContext } from 'botbuilder';
export interface PromptlyBotConversationState<RootTopicState extends ConversationTopicState> {
    rootTopic?: RootTopicState;
}
export interface PromptlyBotTurnContext<BotConversationState extends PromptlyBotConversationState<RootTopicState>, RootTopicState extends ConversationTopicState> extends BotContext {
    conversationState: BotConversationState;
}
export declare abstract class TopicsRoot<BotTurnContext extends PromptlyBotTurnContext<BotConversationState, RootTopicState>, BotConversationState extends PromptlyBotConversationState<RootTopicState>, RootTopicState extends ConversationTopicState> extends ConversationTopic<BotTurnContext, RootTopicState> {
    constructor(context: BotTurnContext);
}
