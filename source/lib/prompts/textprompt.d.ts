import { BotContext } from 'botbuilder';
import { Prompt } from "./prompt";
export declare class TextPrompt<BotTurnContext extends BotContext> extends Prompt<BotTurnContext, string> {
    constructor();
}
