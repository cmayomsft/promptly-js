import * as restify from 'restify';
import { ConversationState, UserState, MemoryStorage, BotContext, BotFrameworkAdapter } from 'botbuilder';
import { BotBootStrap } from './BotBootStrap';
import { StateBotContext } from './StateBotContext';
export { StateBotContext }

export class StateBot<BotConversationState, BotUserState> extends BotBootStrap<StateBotContext<BotConversationState, BotUserState>> {
    conversationState = new ConversationState<BotConversationState>(new MemoryStorage());
    userState = new UserState<BotUserState>(new MemoryStorage());

    server = restify.createServer();

    adapter = new BotFrameworkAdapter()
        .use(this.conversationState);

    getContext(context: BotContext) {
        return StateBotContext.from(context, this.conversationState, this.userState)
    }

    onReceiveActivity(handler: (context: StateBotContext<BotConversationState, BotUserState>) => Promise<void>) {
        this.server.listen(process.env.port || process.env.PORT || 3978, () => {
            console.log(`${ this.server.name } listening to ${ this.server.url }`);
        });

        this.server.post('/api/messages', (req, res) => {
            this.adapter.processRequest(req, res, this.do(handler));
        });

        return Promise.resolve();
    }
}
