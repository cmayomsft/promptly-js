import { TopicsRoot } from '../../../../source';
import { Alarm } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';

export class RootTopic extends TopicsRoot {

    public constructor(context: BotContext) {
        super(context);

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
            if (/add alarm/i.test(context.request.text)) {

                return this.setActiveTopic("addAlarmTopic").onReceive(context);
            }         

            if (this.hasActiveTopic) {
                return this.activeTopic.onReceive(context);
            }

            return this.showDefaultMessage(context);
        }
    }

    public showDefaultMessage(context: BotContext) {
        context.reply("Say 'Add Alarm'.");
    }
}