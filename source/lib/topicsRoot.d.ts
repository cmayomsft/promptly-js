import { ConversationTopic, ConversationTopicState } from './conversationTopic';
import { BotContext } from 'botbuilder';
export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}
export interface PromptlyBotTurnContext extends BotContext {
    conversationState: TopicsRootState;
}
export declare abstract class TopicsRoot<BTC extends PromptlyBotTurnContext, CS extends TopicsRootState> extends ConversationTopic<BTC, ConversationTopicState> {
    constructor(context: BTC);
}
