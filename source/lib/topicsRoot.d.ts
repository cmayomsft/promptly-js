import { ConversationTopic, ConversationTopicState } from './conversationTopic';
import { BotContext } from 'botbuilder';
export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}
export interface PromptlyBotTurnContext extends BotContext {
    conversationState: TopicsRootState;
}
export declare abstract class TopicsRoot<BotTurnContext extends PromptlyBotTurnContext> extends ConversationTopic<BotTurnContext, ConversationTopicState> {
    constructor(context: BotTurnContext);
}
