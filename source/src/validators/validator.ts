import { BotContext } from 'botbuilder';

// ValidatorResult
export interface ValidatorResult<Value> {
    value?: Value;
    reason?: string;
}

// Validator
export abstract class Validator<BotTurnContext extends BotContext, Value> {
    abstract validate(context: BotTurnContext): ValidatorResult<Value>;
}