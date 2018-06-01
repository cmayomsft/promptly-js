import { Validator, ValidatorResult } from '../validators/validator';
import { TurnContext } from 'botbuilder';

export class IntValidator<BotTurnContext extends TurnContext> extends Validator<BotTurnContext, number> {
    public validate(context: BotTurnContext) {
        if((context.activity.text) && (!Number.isNaN(parseInt(context.activity.text)))) {
            return { value: parseInt(context.activity.text) };
        } else {
            return { reason: "notint" };
        }
    }
}