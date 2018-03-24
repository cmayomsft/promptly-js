import { BotContext, UserState, ConversationState } from 'botbuilder';
import { Topic } from "./topic";
import { Validator } from "./validator/validator";
export interface PromptState {
    turns?: number;
}
export declare class Prompt<BUS, BCS, V> extends Topic<BUS, BCS, PromptState, V> {
    constructor(state: PromptState, userState: UserState<BUS>, conversationState: ConversationState<BCS>);
    protected _onPrompt?: (context: BotContext, lastTurnReason: string) => void;
    onPrompt(prompt: (context: BotContext, lastTurnReason: string) => void): this;
    protected _maxTurns: number;
    maxTurns(maxTurns: number): this;
    protected _validator: Validator<V>;
    validator(validator: Validator<V>): this;
    onReceive(context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>): void;
}
