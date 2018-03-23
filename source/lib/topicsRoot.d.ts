import { BotContext } from 'botbuilder';
import { ConversationTopic, ConversationTopicState } from './conversationTopic';
export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}
export interface BotStateContext<BotConversationState extends TopicsRootState> extends BotContext {
    conversationState: BotConversationState;
}
export declare abstract class TopicsRoot<CS extends TopicsRootState> extends ConversationTopic<ConversationTopicState> {
    constructor(context: BotStateContext<CS>);
}
