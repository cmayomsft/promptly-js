import { ParentTopic, ParentTopicState } from './parentTopic';
export interface RootTopicState<S> {
    state?: S;
}
declare global  {
    interface ConversationState {
        rootTopic?: RootTopicState<ParentTopicState>;
    }
}
export declare abstract class TopicRoot extends ParentTopic<ParentTopicState> {
    constructor(context: BotContext);
}
