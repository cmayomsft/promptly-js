import { Topic } from '../promptly/topic';
import { ParentTopic, ActiveTopicState, ParentTopicState } from '../promptly/parentTopic';
import { Alarm, showAlarms } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';
import { DeleteAlarmTopic } from './deleteAlarmTopic';

export class RootTopic extends ParentTopic<ParentTopicState> {

    public constructor(name: string, context: BotContext, state: ParentTopicState = { activeTopic: undefined }) {
        super(name, state);

        this.subTopics = { 
            addAlarmTopic: () => new AddAlarmTopic("addAlarmTopic")
                .onSuccess((context, state) => {
                    if (!context.state.user.alarms) {
                        context.state.user.alarms = [];
                    }
                
                    context.state.user.alarms.push({
                        title: state.alarm.title,
                        time: state.alarm.time
                    });

                    this.state.activeTopic = undefined;

                    return context.reply(`Added alarm named '${state.alarm.title}' set for '${state.alarm.time}'.`);
                })
                .onFailure((context, reason) => {
                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`I'm sorry I'm having issues understanding you. Let's try something else.`);
                    }

                    this.state.activeTopic = undefined;

                    return this.showDefaultMessage(context);
                }), 
                
            deleteAlarmTopic: (alarms: Alarm[]) => new DeleteAlarmTopic("deleteAlarmTopic", alarms)
                .onSuccess((context, state) => {

                    this.state.activeTopic = undefined;

                    if(!state.deleteConfirmed) {
                        return context.reply(`Ok, I won't delete alarm ${state.alarm.title}.`);
                    }

                    context.state.user.alarms.splice(state.alarmIndex, 1);

                    return context.reply(`Done. I've deleted alarm '${state.alarm.title}'.`);
                })
                .onFailure((context, reason) => {
                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`I'm sorry I'm having issues understanding you. Let's try something else.`);
                    }

                    this.state.activeTopic = undefined;

                    return this.showDefaultMessage(context);
                })
        };
    }

    public onReceive(context: BotContext) { 

        if (context.request.type === 'message' && context.request.text.length > 0) {
            if (/show alarms/i.test(context.request.text) || context.ifIntent('showAlarms')) {

                return showAlarms(context, context.state.user.alarms);
            } else if (/add alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.activeTopic = this.subTopics.addAlarmTopic();
            } else if (/delete alarm/i.test(context.request.text) || context.ifIntent('deleteAlarm')) {

                this.activeTopic = this.subTopics.deleteAlarmTopic(context.state.user.alarms);
            } else if (/help/i.test(context.request.text) || context.ifIntent('help')) {

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