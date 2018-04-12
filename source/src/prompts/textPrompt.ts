import { BotContext } from 'botbuilder';
import { Prompt } from "./prompt";
import { TextValidator } from '../validators/textValidator';

export class TextPrompt<BotTurnContext extends BotContext> extends Prompt<BotTurnContext, string> {
    public constructor() {
        super();

        this._validator = new TextValidator<BotTurnContext>();
    }
}