import * as restify from 'restify';
import { ConversationState, MemoryStorage, BotContext, BotFrameworkAdapter } from 'botbuilder';
import { BotBootStrap } from './BotBootStrap';
import { StateBotContext } from './StateBotContext';
export { StateBotContext }

export class StateBot<AppState> extends BotBootStrap<StateBotContext<AppState>> {
    private _onReceiveActivityHandler: (context: StateBotContext<AppState>) => Promise<void>;
    
    conversationState = new ConversationState<AppState>(new MemoryStorage());

    server = restify.createServer()
        .listen(process.env.port || process.env.PORT || 3978, function () {
            console.log(`${this.server.name} listening to ${this.server.url}`);
        })
        .post('/api/messages', (req, res) => {
            this.adapter.processRequest(req, res, async (context) => {
                this.adapter.processRequest(req, res, this.do(this._onReceiveActivityHandler));
            });
        });

    adapter = new BotFrameworkAdapter()
        .use(this.conversationState);

    getContext(context: BotContext) {
        return StateBotContext.from(context, this.conversationState)
    }

    onReceiveActivity(handler: (context: StateBotContext<AppState>) => Promise<void>) {
        this._onReceiveActivityHandler = handler;
        return Promise.resolve();
    }
}
