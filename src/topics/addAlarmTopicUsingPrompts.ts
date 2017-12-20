import { Alarm } from '../alarms';
import { Topic } from '../promptly/topic';
import { Prompt } from '../promptly/prompt';
import { ParentTopic, ParentTopicState } from '../promptly/parentTopic';
import { PromptState } from 'botbuilder-prompts';
import { Validator } from '../validator/validator';

export interface AddAlarmTopicState extends ParentTopicState {
    alarm: Alarm;
}

export class AddAlarmTopicUsingPrompts extends ParentTopic<AddAlarmTopicState> {

    public onReceive(context: BotContext) {

        const promptState = (!this.state.activeTopic) ? { turns: undefined } : this.state.activeTopic.state;

        if (!this.state.alarm.title) {
            this.setActiveTopic(context, 
                new Prompt<string>(promptState)
                    .onPrompt((c, ltvr) => {
                        let msg = `What would you like to name your alarm?`;

                        if(ltvr && ltvr === 'titletoolong') {
                            c.reply(`Sorry, alarm titles must be less that 20 characters.`)
                                .reply(`Let's try again.`);
                        }

                        return c.reply(msg);
                    })
                    .validator(new AlarmTitleValidator())
                    .maxTurns(2)
                    .onSuccess((c, v) => {
                        this.state.alarm.title = v;
                        
                        // TODO: Move this to base class to clean up and (maybe) loop again.
                        this.state.activeTopic = undefined;

                        return this.onReceive(context);
                    })
                    .onFailure((c, fr) => {
                        if(fr && fr === 'toomanyattempts') {
                            c.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                        }

                        // TODO: Move this to base class to clean up and (maybe) loop again.
                        this.state.activeTopic = undefined;

                        // TODO: Remove active topic. Move this to onSuccess/onFailure of calling Topic.
                        context.state.conversation.rootTopic.state.activeTopic = undefined;

                        return;
                    }
                )
            );

            return this.activeTopic.onReceive(context);
        }
    
        if (!this.state.alarm.time) {
            this.setActiveTopic(context, 
                new Prompt<string>(promptState)
                    .onPrompt((c, ltvr) => {

                        return c.reply(`What time would you like to set your alarm for?`);
                    })
                    .validator(new AlarmTimeValidator())
                    .maxTurns(2)
                    .onSuccess((c, v) => {
                        this.state.alarm.time = v;
                        
                        // TODO: Move this to base to clean up and (maybe) loop again.
                        this.state.activeTopic = undefined;

                        return this.onReceive(context);
                    })
                    .onFailure((c, fr) => {
                        if(fr && fr === 'toomanyattempts') {
                            c.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                        }

                        // TODO: Move this to base class to clean up and (maybe) loop again.
                        this.state.activeTopic = undefined;

                        // TODO: Remove active topic. Move this to onSuccess/onFailure of calling Topic.
                        context.state.conversation.rootTopic.state.activeTopic = undefined;

                        return;
                    }
                )
            );

            return this.activeTopic.onReceive(context);
        }
    
        // TODO: Refactor into onSuccess/onFailure of Topic.
        if (!context.state.user.alarms) {
            context.state.user.alarms = [];
        }
    
        context.state.user.alarms.push({
            title: this.state.alarm.title,
            time: this.state.alarm.time
        });

        return context.reply(`Added alarm named '${this.state.alarm.title}' set for '${this.state.alarm.time}'.`);
    }
}

class AlarmTitleValidator extends Validator<string> {
    public validate(context: BotContext) {
        if(context.request.text.length > 20) {
            return { reason: 'titletoolong' };
        } else {
            return { value: context.request.text };
        }
    }
}

class AlarmTimeValidator extends Validator<string> {
    public validate(context: BotContext) {
        return { value: context.request.text };
    }
}