import { TopicsRoot } from 'promptly-bot';
import { Alarm } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';

export class RootTopic extends TopicsRoot {

    public constructor(context: BotContext) {
        super(context);

        // subTopics are functions that can create the active topic on
        //  each turn until it completes.
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
    }

    public onReceive(context: BotContext) { 

        if (context.request.type === 'message' && context.request.text.length > 0) {
            // If the user wants to change the topic of conversation... 
            if (/add alarm/i.test(context.request.text)) {
                // Set the active topic and let the active topic handle this turn.
                return this.setActiveTopic("addAlarmTopic")
                    .onReceive(context);
            }         

            // If there is an active topic, let it handle this turn until it completes.
            if (this.hasActiveTopic) {
                return this.activeTopic
                    .onReceive(context);
            }

            return this.showDefaultMessage(context);
        }
    }

    public showDefaultMessage(context: BotContext) {
        context.reply("Say 'Add Alarm'.");
    }
}

















            /*
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
            */

            /*
            // If the user wants to change the topic of conversation... 
            if (/add alarm/i.test(context.request.text)) {
                // Set the active topic and let the active topic handle this turn.
                return this.setActiveTopic("addAlarmTopic")
                    .onReceive(context);
            }         

            // If there is an active topic, let it handle this turn until it completes.
            if (this.hasActiveTopic) {
                return this.activeTopic
                    .onReceive(context);
            }
            */