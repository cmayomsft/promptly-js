import * as restify from 'restify';
import { ConversationState, UserState, MemoryStorage, TurnContext, BotFrameworkAdapter } from 'botbuilder';
import { BaseBot } from './BaseBot';
import { StateBotContext } from './StateBotContext';
export { StateBotContext }

export class BotFrameworkBot<BotConversationState, BotUserState> extends BaseBot<StateBotContext<BotConversationState, BotUserState>> {
    conversationState = new ConversationState<BotConversationState>(new MemoryStorage());
    userState = new UserState<BotUserState>(new MemoryStorage());

    server = restify.createServer();

    adapter = new BotFrameworkAdapter()
        .use(this.conversationState)
        .use(this.userState);

    getContext(turnContext: TurnContext) {
        return StateBotContext.from(turnContext, this.conversationState, this.userState);
    }

    onReceiveActivity(handler: (context: StateBotContext<BotConversationState, BotUserState>) => Promise<void>) {
        this.server.listen(process.env.port || process.env.PORT || 3978, () => {
            console.log(`${ this.server.name } listening to ${ this.server.url }`);
        });

        this.server.post('/api/messages', (req, res) => {
            this.adapter.processActivity(req, res, this.do(handler));
        });

        return Promise.resolve();
    }
}
