import { TurnContext } from 'botbuilder';
import { Prompt } from "./prompt";
export declare class IntPrompt<BotTurnContext extends TurnContext> extends Prompt<BotTurnContext, number> {
    constructor();
}
