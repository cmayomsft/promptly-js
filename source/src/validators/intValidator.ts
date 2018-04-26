import { Validator, ValidatorResult } from '../validators/validator';
import { BotContext } from 'botbuilder';

export class IntValidator<BotTurnContext extends BotContext> extends Validator<BotTurnContext, number> {
    public validate(context: BotTurnContext) {
        if((context.request.text) && (!Number.isNaN(parseInt(context.request.text)))) {
            return { value: parseInt(context.request.text) };
        } else {
            return { reason: "notint" };
        }
    }
}