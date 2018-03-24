import * as restify from 'restify';
import { BotFrameworkAdapter, ConversationState, UserState, MemoryStorage } from 'botbuilder';
import { TopicsRootState } from 'promptly-bot';
import { StateBot, StateBotContext } from './bot/StateBot';
import { RootTopic } from './topics/rootTopic';
import { Alarm } from './alarms';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Define conversation state shape
export interface BotConversationState extends TopicsRootState { }

// Create conversation state
const conversationState = new ConversationState<BotConversationState>(new MemoryStorage());

// Define user state shape
export interface BotUserState {
    alarms?: Alarm[];
}

// Create user state
const userState = new UserState<BotUserState>(new MemoryStorage());

adapter
    .use(conversationState)
    .use(userState);

const alarmBot = new StateBot<BotConversationState, BotUserState>();

alarmBot.onReceiveActivity(async context => {
    // State isn't fully initialized until the contact/conversation messages are sent, so have to require
    //  activity type is message. Will affect welcome message. Refactor after bug has been addressed.
    if(context.request.type === 'message') {
        
        return new RootTopic(context, userState, conversationState)
            .onReceive(context);
    }
});

/*alarmBot.onReceiveActivity(async context => {
    if (context.request.type === 'message') {
        context.conversationState.count = context.conversationState.count === undefined ? 0 : context.conversationState.count + 1;
        context.userState.name = context.userState.name === undefined ? "Chris" : context.userState.name;
        
        await context.sendActivity(`${context.userState.name} ${context.conversationState.count}: You said "${context.request.text}"`);
    }
});*/