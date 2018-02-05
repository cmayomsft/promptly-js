import { Topic } from './topic';
export interface ActiveTopicState {
    key: string;
    state?: any;
}
export interface ConversationTopicState {
    activeTopic?: ActiveTopicState;
}
export declare abstract class ConversationTopic<S extends ConversationTopicState, V = any> extends Topic<S, V> {
    private _subTopics;
    protected readonly subTopics: Map<string, (any?) => Topic<any>>;
    private _activeTopic;
    setActiveTopic(subTopicKey: string, ...args: any[]): Topic<any, any>;
    readonly activeTopic: Topic<any>;
    readonly hasActiveTopic: boolean;
    clearActiveTopic(): void;
}
