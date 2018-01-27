// ValidatorResult
export interface ValidatorResult<V> {
    value?: V;
    reason?: string;
}

// Validator
export abstract class Validator<V> {
    abstract validate(context: BotContext): ValidatorResult<V>;
}