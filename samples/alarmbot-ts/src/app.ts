import { StateBot, StateBotContext } from './bot/StateBot';
import { RootTopic } from './topics/rootTopic';

// Define conversation state shape
interface BotConversationState {
    count: number;
}

// Define user state shape
interface BotUserState {
    name: string;
}

const alarmBot = new StateBot<BotConversationState>();

alarmBot.onReceiveActivity(async context => {
    if (context.request.type === 'message') {
        context.state.count = context.state.count === undefined ? 0 : context.state.count + 1;

        await context.sendActivity(`${context.state.count}: You said "${context.request.text}"`);
    }
});