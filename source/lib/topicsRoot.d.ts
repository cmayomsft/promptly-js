import { ConversationTopic, ConversationTopicState } from './conversationTopic';
export interface TopicsRootState<S extends ConversationTopicState> {
    state?: S;
}
declare global  {
    interface ConversationState {
        topicsRoot?: TopicsRootState<ConversationTopicState>;
    }
}
export declare abstract class TopicsRoot extends ConversationTopic<ConversationTopicState> {
    constructor(context: BotContext);
}
