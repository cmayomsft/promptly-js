import { TopicsRootState } from 'promptly-bot';
import { StateBot, StateBotContext } from './bot/StateBot';
import { RootTopic } from './topics/rootTopic';
import { Alarm } from './alarms';

// Define conversation state shape
export interface BotConversationState extends TopicsRootState {
    count: number;
}

// Define user state shape
export interface BotUserState {
    alarms?: Alarm[];
}

const alarmBot = new StateBot<BotConversationState, BotUserState>();

alarmBot.onReceiveActivity(async context => {
    // State isn't fully initialized until the contact/conversation messages are sent, so have to require
    //  activity type is message. Will affect welcome message. Refactor after bug has been addressed.
    if(context.request.type === 'message') {
        
        return new RootTopic(context)
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