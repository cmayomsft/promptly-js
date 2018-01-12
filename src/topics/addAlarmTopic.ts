import { Alarm } from '../alarms';
import { Topic } from '../promptly/topic';
import { Prompt } from '../promptly/prompt';
import { ParentTopic, ParentTopicState } from '../promptly/parentTopic';
import { PromptState } from 'botbuilder-prompts';
import { Validator } from '../validator/validator';
import { clearInterval } from 'timers';

export interface AddAlarmTopicState extends ParentTopicState {
    alarm: Alarm;
}

export class AddAlarmTopic extends ParentTopic<AddAlarmTopicState> {

    protected subTopics = { 
        titlePrompt: new Prompt<string>()
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
                // NOTE: Prompts can't be static since they use instance prop/methods.
                this.state.alarm.title = v;
                
                // TODO: Move this to base class to clean up and (maybe) loop again.
                this.state.activeTopic = undefined;

                return this.onReceive(c);
            })
            .onFailure((c, fr) => {

                // TODO: Move this to base class to clean up and (maybe) loop again.
                this.state.activeTopic = undefined;

                return this._onFailure(c, fr);
            }), 

        timePrompt: new Prompt<string>()
            .onPrompt((c, ltvr) => {

                return c.reply(`What time would you like to set your alarm for?`);
            })
            .validator(new AlarmTimeValidator())
            .maxTurns(2)
            .onSuccess((c, v) => {
                this.state.alarm.time = v;
                
                // TODO: Move this to base to clean up and (maybe) loop again.
                this.state.activeTopic = undefined;

                return this.onReceive(c);
            })
            .onFailure((c, fr) => {
                if(fr && fr === 'toomanyattempts') {
                    c.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                }

                // TODO: Move this to base class to clean up and (maybe) loop again.
                this.state.activeTopic = undefined;

                // TODO: Remove active topic. Move this to onSuccess/onFailure of calling Topic.
                c.state.conversation.rootTopic.state.activeTopic = undefined;

                return;
            })
    };


    public constructor(state: AddAlarmTopicState = { alarm: {} as Alarm, activeTopic: undefined }) {
        super(state);        
    };

    public onReceive(context: BotContext) {

        if(this.hasActiveTopic) { 
            return this.activeTopic.onReceive(context);
        }

        if (!this.state.alarm.title) {
            this.activeTopic = this.subTopics.titlePrompt;
            return this.activeTopic.onReceive(context);
        } 
        
        if (!this.state.alarm.time) {
            this.activeTopic = this.subTopics.timePrompt;
            return this.activeTopic.onReceive(context);
        }
        
        return this._onSuccess(context, this.state);
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