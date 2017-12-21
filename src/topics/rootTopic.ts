import { Topic } from '../promptly/topic';
import { ParentTopic, ActiveTopicState, ParentTopicState } from '../promptly/parentTopic';
import { AddAlarmTopic, AddAlarmTopicState } from './addAlarmTopic';
import { DeleteAlarmTopic } from './deleteAlarmTopic';
import { Alarm, showAlarms } from '../alarms';
import { AddAlarmTopicUsingPrompts } from './addAlarmTopicUsingPrompts';
import { DeleteAlarmTopicUsingPrompts } from './deleteAlarmTopicUsingPrompts';

export class RootTopic extends ParentTopic<ParentTopicState> {

    constructor(state: ParentTopicState) {
        super(state);
        this.childTopics = { AddAlarmTopicUsingPrompts, DeleteAlarmTopicUsingPrompts };
    }

    public onReceive(context: BotContext) {
        if (context.request.type === 'message' && context.request.text.length > 0) {
            if (/show alarms/i.test(context.request.text) || context.ifIntent('showAlarms')) {

                return showAlarms(context);
            } else if (/add alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                // Init topic with default state.
                this.setActiveTopic(context, 
                    new AddAlarmTopicUsingPrompts(
                        { 
                            alarm: {} as Alarm,
                            activeTopic: undefined
                        }
                    )
                );
                return this.activeTopic.onReceive(context);
            } else if (/delete alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.setActiveTopic(context, 
                    new DeleteAlarmTopicUsingPrompts(
                        { 
                            alarmIndex: undefined, 
                            alarm: {} as Alarm,
                            deleteConfirmed: undefined,
                            activeTopic: undefined
                        }
                    )
                );
                return this.activeTopic.onReceive(context);
            } else if (/help/i.test(context.request.text) || context.ifIntent('help')) {

                return this.showHelp(context);
                // TODO: Refactor this check into hasActiveTopic property.
            } else if (this.state.activeTopic !== undefined) {    
                // TODO: Refactor into rehydrateActiveTopic (needs better name) and remove context from setActiveTopic.
                this.setActiveTopic(context, 
                    new this.childTopics[this.state.activeTopic.name](this.state.activeTopic.state));
                return this.activeTopic.onReceive(context);    
            } else {
                
                //no command or active topic
                return this.showDefaultMessage(context);
            }
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