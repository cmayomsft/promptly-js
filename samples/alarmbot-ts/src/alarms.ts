import { BotContext } from 'botbuilder';
import { BotConversationState, BotUserState } from './app';
import { StateBotContext } from './bot/StateBotContext';

export interface Alarm {
    title: string;
    time: string;
}

export function findAlarmIndex(alarms: Alarm[], title: string): number {
    return alarms.findIndex((alarm) => {
        return alarm.title.toLowerCase() === title.toLowerCase();
    });
}

export function showAlarms(context: BotContext, alarms: Alarm[]) {

    if (!alarms || (alarms.length === 0)) {
        context.sendActivity(`You have no alarms.`);
        return;
    }

    if (alarms.length == 1) {
        context.sendActivity(`You have one alarm named '${alarms[0].title}', set for ${alarms[0].time}.`);
        return;
    }

    let message = `You have ${alarms.length} alarms: \n\n`;

    alarms.forEach((alarm) => {
        message += `'${alarm.title}' set for ${alarm.time}\n\n`;
    });

    context.sendActivity(message);
}