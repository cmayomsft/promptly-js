import { Alarm } from '../alarms';
import { Topic } from '../promptly/topic';
import { Prompt } from '../promptly/prompt';
import { ParentTopic, ParentTopicState } from '../promptly/parentTopic';
import { Validator } from '../validator/validator';

export interface AddAlarmTopicState extends ParentTopicState {
    alarm: Alarm;
}

export class AddAlarmTopic extends ParentTopic<AddAlarmTopicState, Alarm> {

    public constructor(name: string, state: AddAlarmTopicState = { alarm: {} as Alarm, activeTopic: undefined }) {
        super(name, state);    
        
        this.subTopics
            .set("titlePrompt", () => new Prompt<string>("titlePrompt")
                .onPrompt((context, lastTurnReason) => {
                    let msg = `What would you like to name your alarm?`;
    
                    if(lastTurnReason && lastTurnReason === 'titletoolong') {
                        context.reply(`Sorry, alarm titles must be less that 20 characters.`)
                            .reply(`Let's try again.`);
                    }
    
                    return context.reply(msg);
                })
                .validator(new AlarmTitleValidator())
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.state.activeTopic = undefined;

                    this.state.alarm.title = value;
    
                    return this.onReceive(context);
                })
                .onFailure((context, reason) => {                    
                    this.state.activeTopic = undefined;

                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                    }
    
                    return this._onFailure(context, reason);
                })
            )
            .set("timePrompt", () => new Prompt<string>("timePrompt")
                .onPrompt((context, lastTurnReason) => {
    
                    return context.reply(`What time would you like to set your alarm for?`);
                })
                .validator(new AlarmTimeValidator())
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.state.alarm.time = value;
                    
                    this.state.activeTopic = undefined;
    
                    return this.onReceive(context);
                })
                .onFailure((context, reason) => {
                    this.state.activeTopic = undefined;

                    if(reason && reason === 'toomanyattempts') {
                        return context.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                    }
    
                    return;
                })
            );
    };

    public onReceive(context: BotContext) {

        if(this.hasActiveTopic) { 
            return this.activeTopic.onReceive(context);
        }

        if (!this.state.alarm.title) {
            this.setActiveTopic("titlePrompt");
            return this.activeTopic.onReceive(context);
        } 
        
        if (!this.state.alarm.time) {
            this.setActiveTopic("timePrompt");
            return this.activeTopic.onReceive(context);
        }
        
        return this._onSuccess(context, this.state.alarm);
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