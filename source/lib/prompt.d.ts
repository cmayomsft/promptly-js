import { BotContext } from 'botbuilder';
import { Topic } from "./topic";
import { Validator } from "./validator/validator";
export interface PromptState {
    turns?: number;
}
export declare class Prompt<BotTurnContext extends BotContext, Value> extends Topic<BotTurnContext, PromptState, Value> {
    constructor(state?: PromptState);
    protected _onPrompt?: (context: BotTurnContext, lastTurnReason: string) => void;
    onPrompt(prompt: (context: BotTurnContext, lastTurnReason: string) => void): this;
    protected _maxTurns: number;
    maxTurns(maxTurns: number): this;
    protected _validator: Validator<BotTurnContext, Value>;
    validator(validator: Validator<BotTurnContext, Value>): this;
    onReceiveActivity(context: BotTurnContext): void;
}
