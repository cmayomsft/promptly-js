export interface ValidatorResult<V> {
    value?: V;
    reason?: string;
}
export declare abstract class Validator<V> {
    abstract validate(context: BotContext): ValidatorResult<V>;
}
