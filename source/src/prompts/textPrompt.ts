import { TurnContext } from 'botbuilder';
import { Prompt } from "./prompt";
import { TextValidator } from '../validators/textValidator';

export class TextPrompt<BotTurnContext extends TurnContext> extends Prompt<BotTurnContext, string> {
    public constructor() {
        super();

        this._validator = new TextValidator<BotTurnContext>();
    }
}