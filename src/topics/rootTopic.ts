import { Topic, ActiveTopicState } from './topic';
import { AddAlarmTopic } from './addAlarmTopic';
import { DeleteAlarmTopic } from './deleteAlarmTopic';
import { Alarm, showAlarms } from '../alarms';

// TODO: Type inforce S to at least have ActiveTopicState or derive from it.
export abstract class TopicManager<S> extends Topic<S> {
    // TODO: Refactor and type.
    private _topics: any;
    protected get topics(): any {
        return this._topics;
    }
    protected set topics(topics: any) {
        this._topics = topics;
    }

    private _activeTopic: Topic;
    protected setActiveTopic(context: BotContext, topic: Topic) {
        context.state.conversation.promptName = undefined;

        this._activeTopic = topic;
        context.state.conversation.activeTopic = { name: topic.constructor.name, state: topic.state };
    }
    protected get activeTopic(): Topic {
        return this._activeTopic;
    }
}

export class RootTopic extends TopicManager<ActiveTopicState> {

    constructor(state?: ActiveTopicState) {
        super(state);
        this.topics = { AddAlarmTopic, DeleteAlarmTopic };
    }

    protected getDefaultState(): ActiveTopicState {
        return {
            name: this.constructor.name,
            state: undefined
        }
    }

    public onReceive(context: BotContext) {
        if (context.request.type === 'message' && context.request.text.length > 0) {
            if (/show alarms/i.test(context.request.text) || context.ifIntent('showAlarms')) {

                return showAlarms(context);
            } else if (/add alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.setActiveTopic(context, new AddAlarmTopic());
                return this.activeTopic.onReceive(context);
            } else if (/delete alarm/i.test(context.request.text) || context.ifIntent('addAlarm')) {

                this.setActiveTopic(context, new DeleteAlarmTopic());
                return this.activeTopic.onReceive(context);
            } else if (/help/i.test(context.request.text) || context.ifIntent('help')) {

                return this.showHelp(context);
            } else if (context.state.conversation.activeTopic !== undefined) {    

                this.setActiveTopic(context, 
                    new this.topics[context.state.conversation.activeTopic.name](context.state.conversation.activeTopic.state));
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