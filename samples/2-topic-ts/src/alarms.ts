import { BotContext } from 'botbuilder';
import { BotConversationState, BotUserState } from './app';
import { StateBotContext } from './bot/StateBotContext';

export interface Alarm {
    title: string;
    time: string;
}
