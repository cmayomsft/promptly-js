import { Server } from 'restify';
import { BotContext, BotAdapter, ConversationReference } from 'botbuilder';

export abstract class BaseBot<BaseBotContext> {
    abstract adapter: BotAdapter;
    abstract server: Server

    protected do(handler: (baseBotContext: BaseBotContext) => Promise<void>) {
        return (context: BotContext) => 
            this
                .getContext(context)
                .then(appContext => handler(appContext));
    }
    
    abstract getContext(context: BotContext): Promise<BaseBotContext>;

    abstract onReceiveActivity(handler: (baseBotContext: BaseBotContext) => Promise<void>): Promise<void>;
}
