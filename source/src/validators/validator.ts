import { TurnContext } from 'botbuilder';

// ValidatorResult
export interface ValidatorResult<Value> {
    value?: Value;
    reason?: string;
}

// Validator
export abstract class Validator<BotTurnContext extends TurnContext, Value> {
    abstract validate(context: BotTurnContext): ValidatorResult<Value>;
}