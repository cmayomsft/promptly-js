import { BotContext, BotAdapter, ConversationReference } from 'botbuilder';

export abstract class BotBootStrap<AppContext> {
    abstract adapter: BotAdapter;

    protected do(handler: (appContext: AppContext) => Promise<void>) {
        return (context: BotContext) => 
            this
                .getContext(context)
                .then(appContext => handler(appContext));
    }
    
    abstract getContext(context: BotContext): Promise<AppContext>;

    abstract onReceiveActivity(handler: (appContext: AppContext) => Promise<void>): Promise<void>;
}
