import { Validator, ValidatorResult } from '../validators/validator';
import { BotContext } from 'botbuilder';

export class TextValidator<BotTurnContext extends BotContext> extends Validator<BotTurnContext, string> {
    public validate(context: BotTurnContext) {
        if((context.request.text) && (context.request.text.length > 0)) {
            return { value: context.request.text };
        } else {
            return { reason: "nottext" };
        }
    }
}