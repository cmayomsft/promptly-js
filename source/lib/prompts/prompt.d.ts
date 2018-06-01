import { TurnContext, Activity } from 'botbuilder';
import { Topic } from "../topics/topic";
import { Validator } from "../validators/validator";
export interface PromptState {
    turns?: number;
}
export declare class Prompt<BotTurnContext extends TurnContext, Value> extends Topic<BotTurnContext, PromptState, Value> {
    constructor(state?: PromptState);
    protected _onPrompt?: (context: BotTurnContext, lastTurnReason?: string) => Promise<any>;
    onPrompt(...promptStrings: string[]): this;
    onPrompt(...promptActivities: Activity[]): this;
    onPrompt(promptCallBack: (context: BotTurnContext, lastTurnReason?: string) => Promise<any>): this;
    protected _maxTurns: number;
    maxTurns(maxTurns: number): this;
    protected _validator?: Validator<BotTurnContext, Value>;
    validator(validator: Validator<BotTurnContext, Value>): this;
    onReceiveActivity(context: BotTurnContext): void | Promise<any>;
}
