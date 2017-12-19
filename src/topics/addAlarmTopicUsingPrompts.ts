import { titleValidator } from '../validators';
import { Alarm } from '../alarms';
import { Topic } from '../promptly/topic';
import { Prompt, AlarmTitleValidator } from '../promptly/prompt';

export interface AddAlarmTopicState {
    alarm: Alarm;
}

export class AddAlarmTopicUsingPrompts extends Topic<AddAlarmTopicState> {

    public onReceive(context: BotContext) {
        if (!this.state.alarm.title) {
            if (context.state.conversation.promptName !== "title") {
                context.state.conversation.promptName = "title";
            }
            return this.onDispatch(context);

            const titlePrompt = new Prompt<string>({ turns: undefined })
                .onPrompt((c, ltr) => {})
                .maxTurns(3)
                .validator(new AlarmTitleValidator())
                .onSuccess((c, v) => {})
                .onFailure((c, v) => {})
                .onReceive(context);
        }
    
        if (!this.state.alarm.time) {
            if (context.state.conversation.promptName !== "time") {
                context.state.conversation.promptName = "time";
            }
            return this.onDispatch(context);
        }
    
        if (!context.state.user.alarms) {
            context.state.user.alarms = [];
        }
    
        context.state.user.alarms.push({
            title: this.state.alarm.title,
            time: this.state.alarm.time
        });
    
        // The active topic is done, so clear the active topic and the active prompt.
        //  TODO: Next would be to have the caller clean this up.
        context.state.conversation.rootTopic.state.activeTopic = undefined;
        context.state.conversation.promptTurns = undefined;
        context.state.conversation.promptName = undefined;

        return context.reply(`Added alarm named '${this.state.alarm.title}' set for '${this.state.alarm.time}'.`);
    }
    
    private onDispatch(context: BotContext) {
        switch (context.state.conversation.promptName) {
            case "title": {
                //initial prompt
                if (context.state.conversation.promptTurns === undefined) {
                    context.state.conversation.promptTurns = 1;
                    context.reply(`What would you like to name your alarm?`);
                    return;
                    //handling prompt response
                } else {
                    let titleValidation = titleValidator(context);
                    //If we got what we needed
                    if (titleValidation.value) {
                        //Set value and clear prompt state
                        this.state.alarm.title = titleValidation.value;
                        context.state.conversation.promptTurns = undefined;
                        context.state.conversation.promptName = undefined;
                        return this.onReceive(context);
    
                        //If we didn't get what we needed
                    } else {
                        //if we're under our reprompt threshold
                        if (context.state.conversation.promptTurns <= 2) {
                            context.state.conversation.promptTurns++;
                            //repromt. Here we would use a language generation template to map invalidation reason => reply
                            context.reply(titleValidation.error);
                            return;
                        }
                        //if we're above our prompt threshold
                        context.reply("You're really bad at this. We're taking you back to the main dispatcher");
                        //clear prompt and topic state
                        context.state.conversation.promptTurns = undefined;
                        context.state.conversation.promptName = undefined;
                        context.state.conversation.topicName = undefined;
                        //return to dispatcher
                        return;
                    }
                }
            }
            case "time": {
                //initial prompt
                if (context.state.conversation.promptTurns === undefined) {
                    context.state.conversation.promptTurns = 1;
                    context.reply(`What time would you like to set your alarm for?`);
                    return;
                    //handling prompt response
                } else {
                    //Set value and clear prompt state
                    this.state.alarm.time = context.request.text;
                    context.state.conversation.promptTurns = undefined;
                    context.state.conversation.promptName = undefined;
                    return this.onReceive(context);
                }
            }
            default: {
                console.warn("Prompt was not handled.");
            }
        }
    }
}