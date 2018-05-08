import { Validator, ValidatorResult } from '../validators/validator';
import { TurnContext } from 'botbuilder';

export class TextValidator<BotTurnContext extends TurnContext> extends Validator<BotTurnContext, string> {
    public validate(context: BotTurnContext) {
        if((context.activity.text) && (context.activity.text.length > 0)) {
            return { value: context.activity.text };
        } else {
            return { reason: "nottext" };
        }
    }
}