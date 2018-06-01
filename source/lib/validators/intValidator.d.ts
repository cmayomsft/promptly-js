import { Validator } from '../validators/validator';
import { TurnContext } from 'botbuilder';
export declare class IntValidator<BotTurnContext extends TurnContext> extends Validator<BotTurnContext, number> {
    validate(context: BotTurnContext): {
        value: number;
        reason?: undefined;
    } | {
        reason: string;
        value?: undefined;
    };
}
