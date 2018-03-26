import { PromptlyBotConversationState } from 'promptly-bot';
import { BotFrameworkBot, StateBotContext } from './bot/BotFrameworkBot';
import { RootTopic , RootTopicState } from './topics/rootTopic';
import { Alarm } from './alarms';

// Define conversation state shape
export interface BotConversationState extends PromptlyBotConversationState<RootTopicState> { }

// Define user state shape
export interface BotUserState {
    alarms?: Alarm[];
}

const alarmBot = new BotFrameworkBot<BotConversationState, BotUserState>();

alarmBot.onReceiveActivity(async context => {
    // State isn't fully initialized until the contact/conversation messages are sent, so have to require
    //  activity type is message. Will affect welcome message. Refactor after bug has been addressed.
    if(context.request.type === 'message') {
        
        return new RootTopic(context)
            .onReceiveActivity(context);
    }
});