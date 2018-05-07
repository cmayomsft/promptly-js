import { Validator } from '../validators/validator';
import { BotContext } from 'botbuilder';
export declare class TextValidator<BotTurnContext extends BotContext> extends Validator<BotTurnContext, string> {
    validate(context: BotTurnContext): {
        value: any;
        reason?: undefined;
    } | {
        reason: string;
        value?: undefined;
    };
}
