import { TopicsRoot } from 'promptly-bot';
import { BotConversationState, BotUserState } from '../app';
import { StateBotContext } from '../bot/StateBotContext';
import { Alarm, showAlarms } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';
import { DeleteAlarmTopic } from './deleteAlarmTopic';

export class RootTopic extends TopicsRoot<StateBotContext<BotConversationState, BotUserState>> {

    public constructor(context: StateBotContext<BotConversationState, BotUserState>) {
        super(context);

        // User state initialization should be done once in the welcome 
        //  new user feature. Placing it here until that feature is added.
        if (!context.userState.alarms) {
            context.userState.alarms = [];
        }

        this.subTopics
            .set("addAlarmTopic", () => new AddAlarmTopic()
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    if (!context.userState.alarms) {
                        context.userState.alarms = [];
                    }
                
                    context.userState.alarms.push({
                        title: value.title,
                        time: value.time
                    });

                    return context.sendActivity(`Added alarm named '${ value.title }' set for '${ value.time }'.`);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();

                    if(reason && reason === 'toomanyattempts') {
                        context.sendActivity(`Let's try something else.`);
                    }

                    return this.showDefaultMessage(context);
                })
            )
            .set("deleteAlarmTopic", (alarms: Alarm[]) => new DeleteAlarmTopic(alarms)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    if(!value.deleteConfirmed) {
                        return context.sendActivity(`Ok, I won't delete alarm ${value.alarm.title}.`);
                    }

                    context.userState.alarms.splice(value.alarmIndex, 1);

                    return context.sendActivity(`Done. I've deleted alarm '${value.alarm.title}'.`);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();
                    
                    if(reason && reason === 'toomanyattempts') {
                        context.sendActivity(`Let's try something else.`);
                    }

                    return this.showDefaultMessage(context);
                })
            );
    }

    public onReceiveActivity(context: StateBotContext<BotConversationState, BotUserState>) { 

        if (context.request.type === 'message' && context.request.text.length > 0) {
            
            if (/show alarms/i.test(context.request.text)) {
                this.clearActiveTopic();

                return showAlarms(context, context.userState.alarms);
            } else if (/add alarm/i.test(context.request.text)) {

                return this.setActiveTopic("addAlarmTopic")
                    .onReceiveActivity(context);
            } else if (/delete alarm/i.test(context.request.text)) {

                return this.setActiveTopic("deleteAlarmTopic", context.userState.alarms)
                    .onReceiveActivity(context);
            } else if (/help/i.test(context.request.text)) {
                this.clearActiveTopic();

                return this.showHelp(context);
            }

            if (this.hasActiveTopic) {
                return this.activeTopic.onReceiveActivity(context);
            }

            return this.showDefaultMessage(context);
        }
    }

    public showDefaultMessage(context: StateBotContext<BotConversationState, BotUserState>) {
        context.sendActivity("'Show Alarms', 'Add Alarm', 'Delete Alarm', 'Help'.");
    }
        
    private showHelp(context: StateBotContext<BotConversationState, BotUserState>) {
        let message = "Here's what I can do:\n\n";
        message += "To see your alarms, say 'Show Alarms'.\n\n";
        message += "To add an alarm, say 'Add Alarm'.\n\n";
        message += "To delete an alarm, say 'Delete Alarm'.\n\n";
        message += "To see this again, say 'Help'.";
    
        context.sendActivity(message);
    }
}