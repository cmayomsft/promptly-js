import { BotContext } from 'botbuilder';
import { Prompt } from "./prompt";
export declare class IntPrompt<BotTurnContext extends BotContext> extends Prompt<BotTurnContext, number> {
    constructor();
}
