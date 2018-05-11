import { Server } from 'restify';
import { TurnContext, BotAdapter, ConversationReference } from 'botbuilder';

export abstract class BaseBot<BaseBotContext> {
    abstract adapter: BotAdapter;
    abstract server: Server

    protected do(handler: (baseBotContext: BaseBotContext) => Promise<void>) {
        return (context: TurnContext) => 
            this
                .getContext(context)
                .then(appContext => handler(appContext));
    }
    
    abstract getContext(context: TurnContext): Promise<BaseBotContext>;

    abstract onReceiveActivity(handler: (baseBotContext: BaseBotContext) => Promise<void>): Promise<void>;
}
