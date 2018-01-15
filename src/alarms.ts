export interface Alarm {
    title: string;
    time: string;
}

declare global {
    export interface UserState {
        /** Users list of active alarms. */
        alarms?: Alarm[];
    }
}

export function findAlarmIndex(alarms: Alarm[], title: string): number {
    return alarms.findIndex((alarm) => {
        return alarm.title.toLowerCase() === title.toLowerCase();
    });
}

export function showAlarms(context: BotContext, alarms: Alarm[]) {

    if (!alarms || (alarms.length === 0)) {
        context.reply(`You have no alarms.`);
        return;
    }

    if (alarms.length == 1) {
        context.reply(`You have one alarm named '${alarms[0].title}', set for ${alarms[0].time}.`);
        return;
    }

    let message = `You have ${alarms.length} alarms: \n\n`;

    alarms.forEach((alarm) => {
        message += `'${alarm.title}' set for ${alarm.time}\n\n`;
    });

    context.reply(message);
}