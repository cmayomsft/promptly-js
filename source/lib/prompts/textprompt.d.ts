import { TurnContext } from 'botbuilder';
import { Prompt } from "./prompt";
export declare class TextPrompt<BotTurnContext extends TurnContext> extends Prompt<BotTurnContext, string> {
    constructor();
}
