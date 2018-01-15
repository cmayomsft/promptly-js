import { Topic } from '../promptly/topic';
import { ParentTopic, ActiveTopicState, ParentTopicState } from '../promptly/parentTopic';
import { Alarm, showAlarms } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';
import { DeleteAlarmTopic } from './deleteAlarmTopic';

export class RootTopic extends ParentTopic<ParentTopicState> {

    public constructor(context: BotContext, state: ParentTopicState = { activeTopic: undefined }) {
        super(state);

        this.subTopics = { 
            addAlarmTopic: new AddAlarmTopic()
                .onSuccess((c, s) => {
                    if (!c.state.user.alarms) {
                        c.state.user.alarms = [];
                    }
                
                    c.state.user.alarms.push({
                        title: s.alarm.title,
                        time: s.alarm.time
                    });

                    this.state.activeTopic = undefined;

                    return c.reply(`Added alarm named '${s.alarm.title}' set for '${s.alarm.time}'.`);
                })
                .onFailure((c, fr) => {
                    if(fr && fr === 'toomanyattempts') {
                        c.reply(`I'm sorry I'm having issues understanding you. Let's try something else.`);
                    }

                    this.state.activeTopic = undefined;

                    return this.showDefaultMessage(c);
                }), 
                
            deleteAlarmTopic: new DeleteAlarmTopic(context.state.user.alarms)
                .onSuccess((c, s) => {
                    if (s.deleteConfirmed) {
                        c.state.user.alarms.splice(s.alarmIndex, 1);
                        return c.reply(`Done. I've deleted alarm '${s.alarm.title}'.`);
                    } else {
                        return c.reply(`Ok, I won't delete alarm ${s.alarm.title}.`);
                    }
                })
                .onFailure((c, fr) => {
                    if(fr && fr === 'toomanyattempts') {
                        c.reply(`I'm sorry I'm having issues understanding you. Let's try something else.`);
                    }

                    this.state.activeTopic = undefined;

                    return this.showDefaultMessage(c);
                })
            };
    }

    public onReceive(context: BotContext) { 

        if (context.request.type === 'message' && context.request.text.length > 0) {
            if (/show alarms/i.test(context.request.text) || context.ifIntent('showAlarms')) {

                return showAlarms(context, context.state.user.alarms);
            } else if (/add alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.activeTopic = this.subTopics.addAlarmTopic;
            } else if (/delete alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.activeTopic = this.subTopics.deleteAlarmTopic;
            } else if (/help/i.test(context.request.text) || context.ifIntent('help')) {

                return this.showHelp(context);
            }

            if (this.hasActiveTopic) {    
                return this.activeTopic.onReceive(context);    
            }

            return this.showDefaultMessage(context);
        }
    }

    // TODO: Refactor to a card with buttons.
    public showDefaultMessage(context: BotContext) {
        context.reply("'Show Alarms', 'Add Alarm', 'Delete Alarm', 'Help'.");
    }
        
    // TODO: Refactor to a card w/ buttons.
    private showHelp(context: BotContext) {
        let message = "Here's what I can do:\n\n";
        message += "To see your alarms, say 'Show Alarms'.\n\n";
        message += "To add an alarm, say 'Add Alarm'.\n\n";
        message += "To delete an alarm, say 'Delete Alarm'.\n\n";
        message += "To see this again, say 'Help'.";
    
        context.reply(message);
    }
}