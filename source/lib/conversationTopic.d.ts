import { Topic } from './topic';
export interface ActiveTopicState {
    key: string;
    state?: any;
}
export interface ConversationTopicState {
    activeTopic?: ActiveTopicState;
}
export declare abstract class ConversationTopic<BUS, BCS, S extends ConversationTopicState, V = any> extends Topic<BUS, BCS, S, V> {
    private _subTopics;
    protected readonly subTopics: Map<string, (any?) => Topic<BUS, BCS, any>>;
    private _activeTopic;
    setActiveTopic(subTopicKey: string, ...args: any[]): Topic<BUS, BCS, any, any>;
    readonly activeTopic: Topic<BUS, BCS, any>;
    readonly hasActiveTopic: boolean;
    clearActiveTopic(): void;
}
