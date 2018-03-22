import { ConversationState, MemoryStorage, BotContext, BotFrameworkAdapter } from 'botbuilder';
import { BotBootStrap } from './BotBootStrap';
import { StateBotContext } from './StateBotContext';
export { StateBotContext }

export class StateBot<AppState> extends BotBootStrap<StateBotContext<AppState>> {
    conversationState = new ConversationState<AppState>(new MemoryStorage());

    adapter = new BotFrameworkAdapter()
        .use(this.conversationState);

    getContext(
        context: BotContext,
    ) {
        return StateBotContext.from(context, this.conversationState)
    }

    onReceiveActivity(
        handler: (
            context: StateBotContext<AppState>,
        ) => Promise<void>
    ) {
        this.adapter.processRequest(this.do(handler));
        return Promise.resolve();
    }
}
