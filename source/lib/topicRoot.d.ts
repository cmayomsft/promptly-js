import { ParentTopic, ParentTopicState } from './parentTopic';
export interface TopicsRootState<S> {
    state?: S;
}
declare global  {
    interface ConversationState {
        topicsRoot?: TopicsRootState<ParentTopicState>;
    }
}
export declare abstract class TopicsRoot extends ParentTopic<ParentTopicState> {
    constructor(context: BotContext);
}
