import { TurnContext } from 'botbuilder';
import { Prompt } from "./prompt";
import { IntValidator } from '../validators/intValidator';

export class IntPrompt<BotTurnContext extends TurnContext> extends Prompt<BotTurnContext, number> {
    public constructor() {
        super();

        this._validator = new IntValidator<BotTurnContext>();
    }
}