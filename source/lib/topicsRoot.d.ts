import { BotContext, UserState, ConversationState } from 'botbuilder';
import { ConversationTopic, ConversationTopicState } from './conversationTopic';
export interface TopicsRootState {
    rootTopic?: ConversationTopicState;
}
export interface PromptlyBotTurnContext extends BotContext {
    conversationState: TopicsRootState;
}
export declare abstract class TopicsRoot<BUS, BCS extends TopicsRootState> extends ConversationTopic<BUS, BCS, ConversationTopicState> {
    constructor(context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>);
}
