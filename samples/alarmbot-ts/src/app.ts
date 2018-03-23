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

const alarmBot = new StateBot<BotConversationState, BotUserState>();

alarmBot.onReceiveActivity(async context => {
    if (context.request.type === 'message') {
        context.conversationState.count = context.conversationState.count === undefined ? 0 : context.conversationState.count + 1;
        context.userState.name = context.userState.name === undefined ? "Chris" : context.userState.name;

        await context.sendActivity(`${context.userState.name} ${context.conversationState.count}: You said "${context.request.text}"`);
    }
});