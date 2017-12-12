import { Topic, AddAlarmTopic } from './topics/addAlarmTopic';
import { DeleteAlarmTopic } from './topics/deleteAlarmTopic';
import { Alarm, showAlarms } from './alarms';

export interface ActiveTopicState {
    name: string;
    state?: any;
}

declare global {
    export interface ConversationState {
        activeTopicState?: ActiveTopicState;
    }
}

export class MainDispatcher {
    private _topics = { AddAlarmTopic, DeleteAlarmTopic };

    private _activeTopic: Topic;
    private setActiveTopic(context: BotContext, topic: Topic) {
        context.state.conversation.promptName = undefined;

        this._activeTopic = topic;
        context.state.conversation.activeTopicState = { name: topic.constructor.name, state: topic.state };
    }

    public onReceive(context: BotContext) {
        if (context.request.type === 'message' && context.request.text.length > 0) {
            if (/show alarms/i.test(context.request.text) || context.ifIntent('showAlarms')) {

                return showAlarms(context);
            } else if (/add alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.setActiveTopic(context, new AddAlarmTopic());
                return this._activeTopic.onReceive(context);
            } else if (/delete alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.setActiveTopic(context, new DeleteAlarmTopic());
                return this._activeTopic.onReceive(context);
            } else if (/help/i.test(context.request.text) || context.ifIntent('help')) {

                return this.showHelp(context);
            } else if (context.state.conversation.activeTopicState !== undefined) {    

                this.setActiveTopic(context, 
                    new this._topics[context.state.conversation.activeTopicState.name](context.state.conversation.activeTopicState.state));
                return this._activeTopic.onReceive(context);    
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