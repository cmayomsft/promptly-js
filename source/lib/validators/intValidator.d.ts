import { Validator } from '../validators/validator';
import { BotContext } from 'botbuilder';
export declare class IntValidator<BotTurnContext extends BotContext> extends Validator<BotTurnContext, number> {
    validate(context: BotTurnContext): {
        value: number;
        reason?: undefined;
    } | {
        reason: string;
        value?: undefined;
    };
}
