import { BotContext } from 'botbuilder';
import { Topic } from './topic';
export interface ActiveTopicState {
    key: string;
    state?: any;
}
export interface ConversationTopicState {
    activeTopic?: ActiveTopicState;
}
export declare abstract class ConversationTopic<BTC extends BotContext, S extends ConversationTopicState, V = any> extends Topic<BTC, S, V> {
    private _subTopics;
    protected readonly subTopics: Map<string, (any?) => Topic<BTC, any>>;
    private _activeTopic;
    setActiveTopic(subTopicKey: string, ...args: any[]): Topic<BTC, any, any>;
    readonly activeTopic: Topic<BTC, any>;
    readonly hasActiveTopic: boolean;
    clearActiveTopic(): void;
}
