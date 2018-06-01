import { Validator } from '../validators/validator';
import { TurnContext } from 'botbuilder';
export declare class TextValidator<BotTurnContext extends TurnContext> extends Validator<BotTurnContext, string> {
    validate(context: BotTurnContext): {
        value: string;
        reason?: undefined;
    } | {
        reason: string;
        value?: undefined;
    };
}
