import { BotContext } from 'botbuilder';
export interface ValidatorResult<V> {
    value?: V;
    reason?: string;
}
export declare abstract class Validator<BTC extends BotContext, V> {
    abstract validate(context: BTC): ValidatorResult<V>;
}
