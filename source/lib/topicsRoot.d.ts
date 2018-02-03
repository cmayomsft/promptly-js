import { ConversationTopic, ConversationTopicState } from './parentTopic';
export interface TopicsRootState<S> {
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
