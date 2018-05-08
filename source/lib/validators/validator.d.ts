import { TurnContext } from 'botbuilder';
export interface ValidatorResult<Value> {
    value?: Value;
    reason?: string;
}
export declare abstract class Validator<BotTurnContext extends TurnContext, Value> {
    abstract validate(context: BotTurnContext): ValidatorResult<Value>;
}
