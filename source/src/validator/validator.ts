import { BotContext } from 'botbuilder';

// ValidatorResult
export interface ValidatorResult<V> {
    value?: V;
    reason?: string;
}

// Validator
export abstract class Validator<BTC extends BotContext, V> {
    abstract validate(context: BTC): ValidatorResult<V>;
}