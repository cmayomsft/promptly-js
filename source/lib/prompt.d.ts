import { BotContext } from 'botbuilder';
import { Topic } from "./topic";
import { Validator } from "./validator/validator";
export interface PromptState {
    turns?: number;
}
export declare class Prompt<BTC extends BotContext, V> extends Topic<BTC, PromptState, V> {
    constructor(state?: PromptState);
    protected _onPrompt?: (context: BTC, lastTurnReason: string) => void;
    onPrompt(prompt: (context: BTC, lastTurnReason: string) => void): this;
    protected _maxTurns: number;
    maxTurns(maxTurns: number): this;
    protected _validator: Validator<BTC, V>;
    validator(validator: Validator<BTC, V>): this;
    onReceive(context: BTC): void;
}
