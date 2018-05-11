import { ServiceBot } from 'botbuilder-botbldr';
import { PromptlyBotConversationState } from 'promptly-bot';
import { RootTopic , RootTopicState } from './topics/rootTopic';

// Define conversation state shape
export interface BotConversationState extends PromptlyBotConversationState<RootTopicState> { }
export interface BotUserState { }

const simplePromptBot = new ServiceBot<BotConversationState, BotUserState>();

simplePromptBot.onTurn(async turnContext => {
    // State isn't fully initialized until the contact/conversation messages are sent, so have to require
    //  activity type is message. Will affect welcome message. Refactor after bug has been addressed.
    if(turnContext.activity.type === 'message') {
        
        return new RootTopic(turnContext)
            .onReceiveActivity(turnContext);
    }
});