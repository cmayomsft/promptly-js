import { ServiceBot } from 'botbuilder-botbldr';
import { PromptlyBotConversationState } from 'promptly-bot';
import { RootTopic, RootTopicState } from './topics/rootTopic';
import { Alarm } from './models/alarms';

// Define conversation state shape
export interface BotConversationState extends PromptlyBotConversationState<RootTopicState> { }

// Define user state shape
export interface BotUserState {
    alarms?: Alarm[];
}

const alarmBot = new ServiceBot<BotConversationState, BotUserState>();

alarmBot.onTurn(async context => {
        
        return new RootTopic(context)
            .onReceiveActivity(context);
});