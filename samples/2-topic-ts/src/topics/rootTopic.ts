import { TopicsRoot, ConversationTopicState } from 'promptly-bot';
import { BotConversationState, BotUserState } from '../app';
import { StateBotContext } from '../bot/StateBotContext';
import { Alarm } from '../alarms';
import { AddAlarmTopic } from './addAlarmTopic';

export interface RootTopicState extends ConversationTopicState { }

export class RootTopic 
    extends TopicsRoot<
        StateBotContext<BotConversationState, BotUserState>, 
        BotConversationState, 
        RootTopicState> {

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
            );
    }

    public onReceiveActivity(context: StateBotContext<BotConversationState, BotUserState>) { 

        if (context.request.type === 'message' && context.request.text.length > 0) {
            
            // If the user wants to change the topic of conversation...
            if (/add alarm/i.test(context.request.text)) {

                // Set the active topic and let the active topic handle this turn.
                return this.setActiveTopic("addAlarmTopic")
                    .onReceiveActivity(context);
            }

            // If there is an active topic, let it handle this turn.
            if (this.hasActiveTopic) {
                return this.activeTopic.onReceiveActivity(context);
            }

            return this.showDefaultMessage(context);
        }
    }

    public showDefaultMessage(context: StateBotContext<BotConversationState, BotUserState>) {
        context.sendActivity("'Add Alarm'.");
    }
}