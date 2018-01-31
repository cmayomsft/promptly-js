import { Topic } from 'promptly-bot';
import { ParentTopic, ActiveTopicState, ParentTopicState } from 'promptly-bot';
import { Alarm, showAlarms } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';
import { DeleteAlarmTopic } from './deleteAlarmTopic';

export interface RootTopicState<S> {
    state?: S;
}

declare global {
    export interface ConversationState {
        rootTopic?: RootTopicState<ParentTopicState>;
    }
}

export class RootTopic extends ParentTopic<ParentTopicState> {

    public constructor(context: BotContext) {
        // Initialize the root topic state and pass that reference to root topic to facilitate the state 
        //  reference chain to context.state.conversation.
        if (!context.state.conversation.rootTopic) {
            context.state.conversation.rootTopic = { 
                state: { activeTopic: undefined } 
            };
        }

        super(context.state.conversation.rootTopic.state);

        this.subTopics
            .set("addAlarmTopic", () => new AddAlarmTopic()
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    if (!context.state.user.alarms) {
                        context.state.user.alarms = [];
                    }
                
                    context.state.user.alarms.push({
                        title: value.title,
                        time: value.time
                    });

                    return context.reply(`Added alarm named '${ value.title }' set for '${ value.time }'.`);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();

                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`Let's try something else.`);
                    }

                    return this.showDefaultMessage(context);
                })
            )
            .set("deleteAlarmTopic", (alarms: Alarm[]) => new DeleteAlarmTopic("deleteAlarmTopic", alarms)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    if(!value.deleteConfirmed) {
                        return context.reply(`Ok, I won't delete alarm ${value.alarm.title}.`);
                    }

                    context.state.user.alarms.splice(value.alarmIndex, 1);

                    return context.reply(`Done. I've deleted alarm '${value.alarm.title}'.`);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();
                    
                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`Let's try something else.`);
                    }

                    return this.showDefaultMessage(context);
                })
            );
    }

    public onReceive(context: BotContext) { 

        if (context.request.type === 'message' && context.request.text.length > 0) {
            if (/show alarms/i.test(context.request.text) || context.ifIntent('showAlarms')) {
                this.clearActiveTopic();

                return showAlarms(context, context.state.user.alarms);
            } else if (/add alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.setActiveTopic("addAlarmTopic");
            } else if (/delete alarm/i.test(context.request.text) || context.ifIntent('deleteAlarm')) {

                this.setActiveTopic("deleteAlarmTopic", context.state.user.alarms);
            } else if (/help/i.test(context.request.text) || context.ifIntent('help')) {
                this.clearActiveTopic();

                return this.showHelp(context);
            }

            if (this.hasActiveTopic) {    
                return this.activeTopic.onReceive(context);    
            }

            return this.showDefaultMessage(context);
        }
    }

    public showDefaultMessage(context: BotContext) {
        context.reply("'Show Alarms', 'Add Alarm', 'Delete Alarm', 'Help'.");
    }
        
    private showHelp(context: BotContext) {
        let message = "Here's what I can do:\n\n";
        message += "To see your alarms, say 'Show Alarms'.\n\n";
        message += "To add an alarm, say 'Add Alarm'.\n\n";
        message += "To delete an alarm, say 'Delete Alarm'.\n\n";
        message += "To see this again, say 'Help'.";
    
        context.reply(message);
    }
}