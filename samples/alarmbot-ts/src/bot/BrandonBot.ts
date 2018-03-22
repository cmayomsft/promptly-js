import { ConversationState, ConsoleAdapter, MemoryStorage, BotContext, ConversationReference } from 'botbuilder';
import { BotBootStrap } from './BotBootStrap';
import { BrandonContext } from './BrandonContext';
export { BrandonContext }

export class StateBot<AppState> extends BotBootStrap<BrandonContext<AppState>> {
    conversationState = new ConversationState<AppState>(new MemoryStorage());

    adapter = new ConsoleAdapter()
        .use(this.conversationState);

    getContext(
        context: BotContext,
    ) {
        return BrandonContext.from(context, this.conversationState)
    }

    onRequest(
        handler: (
            context: BrandonContext<AppState>,
        ) => Promise<void>
    ) {
        this.adapter.listen(this.do(handler));
        return Promise.resolve();
    }
}
