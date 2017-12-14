import { Alarm, showAlarms, findAlarmIndex } from '../alarms';
import { Topic } from '../promptly/topic';

export interface DeleteAlarmTopicState {
    alarmIndex?: number;
    alarm?: Partial<Alarm>;
    deleteConfirmed?: boolean;
}

export class DeleteAlarmTopic extends Topic<DeleteAlarmTopicState> {
    
    public onReceive(context: BotContext) {
        const alarms = context.state.user.alarms || [];

        // This undefined check is needed in case the user asks to delete alarm before the user has alarms.
        //  The default in DeleteAlarmTopicState will be overwritten by the user state of an empty array.
        if (alarms.length === 0) {
            context.reply(`There are no alarms to delete.`);
            return;
        }

        if (this.state.alarmIndex === undefined) {
            //Basically the prompt in a choice prompt, so show the alarms.
            showAlarms(context);
    
            if (alarms.length === 1) {
                // There is only one alarm, so get the title so you can use it to just confirm whether the user
                //  wants to delete the alarm.
                this.state.alarmIndex = 0;
    
            } else if (alarms.length > 1) {
                if(context.state.conversation.promptName !== "title") {
                    context.state.conversation.promptName = "title";                    
                }
                return this.onDispatch(context);
            }
        }

        this.state.alarm.title = alarms[this.state.alarmIndex].title;
    
        if (this.state.deleteConfirmed === undefined) {
            if(context.state.conversation.promptName !== "deleteConfirmed") {
                context.state.conversation.promptName = "deleteConfirmed";    
            }
            return this.onDispatch(context);
        }

        if (this.state.deleteConfirmed === false) {
            context.reply(`Ok, I won't delete alarm ${this.state.alarm.title} then.`);
        } else {
            alarms.splice(this.state.alarmIndex, 1);
            return context.reply(`Done. I've deleted alarm '${this.state.alarm.title}'.`);
        }

        // The active topic is done, so clear the active topic and the active prompt.
        context.state.conversation.rootTopic.activeTopic = undefined;
        context.state.conversation.promptTurns = undefined;
        context.state.conversation.promptName = undefined;
        
        return;
    }
    
    private onDispatch(context: BotContext) {
        switch (context.state.conversation.promptName) {
            case "title": {
                if (context.state.conversation.promptTurns === undefined) {
                    context.state.conversation.promptTurns = 1;
                    context.reply(`Which alarm would you like to delete?`);
                    return;
                } else {
                    this.state.alarm.title = context.request.text;
                    const foundAlarmIndex = findAlarmIndex(context.state.user.alarms, this.state.alarm.title);
                    if (foundAlarmIndex < 0) {
                        context.state.conversation.promptTurns++;
                        context.reply(`I couldn't find an alarm named '${this.state.alarm.title}'`);
                    } else {
                        this.state.alarmIndex = foundAlarmIndex;
                        context.state.conversation.promptTurns = undefined;
                        context.state.conversation.promptName = undefined;
                    }
                    return this.onReceive(context);
                }
            }
            case "deleteConfirmed": {
                if(context.state.conversation.promptTurns === undefined) {
                    context.state.conversation.promptTurns = 1;
                    context.reply(`Are you sure you want to delete alarm '${this.state.alarm.title}' ('yes' or 'no')?`);
                    return;
                } else {
                    //we could use a validator here like we do when choosing alarms
                    let response = context.request.text.toLowerCase();
                    if (response !== "yes" && response !== "no") {
                        context.state.conversation.promptTurns++;
                        context.reply(`I didn't understand... Let's try again.`);
                    } else {
                        //Translate yes | no into a boolean
                        this.state.deleteConfirmed = (response === "yes") ? true : false;
                        context.state.conversation.promptTurns = undefined;
                        context.state.conversation.promptName = undefined;
                    }
                    return this.onReceive(context);
                }
            }
            default: {
                console.warn("Prompt was not handled.");
            }
        }
    }
}