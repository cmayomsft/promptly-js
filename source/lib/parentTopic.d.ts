import { Topic } from './topic';
export interface ActiveTopicState {
    name: string;
    state?: any;
}
export interface ParentTopicState {
    activeTopic?: ActiveTopicState;
}
export declare abstract class ParentTopic<S extends ParentTopicState, V = any> extends Topic<S, V> {
    private _subTopics;
    protected readonly subTopics: Map<string, (any?) => Topic<any>>;
    private _activeTopic;
    readonly activeTopic: Topic<any>;
    setActiveTopic(subTopicKey: string, ...args: any[]): Topic<any, any>;
    readonly hasActiveTopic: boolean;
    clearActiveTopic(): void;
}
