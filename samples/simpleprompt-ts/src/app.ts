import { ServiceBot } from 'botbuilder-botbldr';
import { PromptlyBotConversationState } from 'promptly-bot';
import { RootTopic , RootTopicState } from './topics/rootTopic';

// Define conversation state shape
export interface BotConversationState extends PromptlyBotConversationState<RootTopicState> { }

// Define user state shape
export interface BotUserState { }

const simplePromptBot = new ServiceBot<BotConversationState, BotUserState>();

simplePromptBot.onTurn(async turnContext => {

    return new RootTopic(turnContext)
        .onTurn(turnContext);
});