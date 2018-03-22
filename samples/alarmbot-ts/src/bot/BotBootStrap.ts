import { BotContext, BotAdapter, ConversationReference } from 'botbuilder';

export abstract class BotBootStrap<AppContext> {
    abstract adapter: BotAdapter;

    protected do (
        handler: (appContext: AppContext,
    ) => Promise<void>) {
        return (context: BotContext) => this
            .getContext(context)
            .then(appContext => handler(appContext));
    }
    
    abstract getContext(
        context: BotContext
    ): Promise<AppContext>;

    abstract onRequest(
        handler: (
            appContext: AppContext,
        ) => Promise<void>
    ): Promise<void>;

    startConversation(
        reference: Partial<ConversationReference>,
        handler: (
            appContext: AppContext,
        ) => Promise<void>
    ) {
        // This will have to wait until startConversation is added to BotAdapter
        // return this.adapter.startConversation(reference, this.do(handler))
        return Promise.resolve();
    }

    continueConversation(
        reference: Partial<ConversationReference>,
        handler: (
            appContext: AppContext,
        ) => Promise<void>
    ) {
        // This will have to wait until startConversation is added to BotAdapter
        // return this.adapter.continueConversation(reference, this.do(handler))
        return Promise.resolve();
    }
}
