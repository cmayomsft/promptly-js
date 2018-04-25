import { BotContext, Activity } from 'botbuilder';
import { Topic } from "../topics/topic";
import { Validator } from "../validators/validator";
export interface PromptState {
    turns?: number;
}
export declare class Prompt<BotTurnContext extends BotContext, Value> extends Topic<BotTurnContext, PromptState, Value> {
    constructor(state?: PromptState);
    protected _onPrompt?: (context: BotTurnContext, lastTurnReason: string) => void;
    onPrompt(...promptStrings: string[]): any;
    onPrompt(...promptActivities: Partial<Activity>[]): any;
    onPrompt(promptCallBack: (context: BotTurnContext, lastTurnReason: string) => void): any;
    protected _maxTurns: number;
    maxTurns(maxTurns: number): this;
    protected _validator: Validator<BotTurnContext, Value>;
    validator(validator: Validator<BotTurnContext, Value>): this;
    onReceiveActivity(context: BotTurnContext): void;
}
