import { Validator } from "../validator/validator";

export class AlarmTitleValidator extends Validator<string> {
    public validate(context: BotContext) {
        if(context.request.text.length > 20) {
            return { reason: 'titletoolong' };
        } else {
            return { value: context.request.text };
        }
    }
}

export class AlarmTimeValidator extends Validator<string> {
    public validate(context: BotContext) {
        return { value: context.request.text };
    }
}