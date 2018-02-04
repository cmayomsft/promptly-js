import { Alarm } from '../alarms';
import { ConversationTopic, ConversationTopicState, Prompt, Validator } from 'promptly-bot';

export interface AddAlarmTopicState extends ConversationTopicState {
    alarm: Alarm;
}

export class AddAlarmTopic extends ConversationTopic<AddAlarmTopicState, Alarm> {

    public constructor(state: AddAlarmTopicState = { alarm: {} as Alarm, activeTopic: undefined }) {
        super(state);    
        
        this.subTopics
            .set("titlePrompt", () => new Prompt<string>()
                .onPrompt((context, lastTurnReason) => {
   
                    if(lastTurnReason && lastTurnReason === 'titletoolong') {
                        context.reply(`Sorry, alarm titles must be less that 20 characters.`)
                            .reply(`Let's try again.`);
                    }
    
                    return context.reply(`What would you like to name your alarm?`);
                })
                .validator(new AlarmTitleValidator())
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    this.state.alarm.title = value;
    
                    return this.onReceive(context);
                })
                .onFailure((context, reason) => {                    
                    this.clearActiveTopic();

                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`I'm sorry I'm having issues understanding you.`);
                    }
    
                    return this._onFailure(context, reason);
                })
            )
            .set("timePrompt", () => new Prompt<string>()
                .onPrompt((context, lastTurnReason) => {
                    return context.reply(`What time would you like to set your alarm for?`);
                })
                .validator(new AlarmTimeValidator())
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    this.state.alarm.time = value;
    
                    return this.onReceive(context);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();

                    if(reason && reason === 'toomanyattempts') {
                        return context.reply(`I'm sorry I'm having issues understanding you.`);
                    }
    
                    return this._onFailure(context, reason);;
                })
            );
    };

    public onReceive(context: BotContext) {

        if(this.hasActiveTopic) { 
            return this.activeTopic.onReceive(context);
        }

        if (!this.state.alarm.title) {
            return this.setActiveTopic("titlePrompt").onReceive(context);
        } 
        
        if (!this.state.alarm.time) {
            return this.setActiveTopic("timePrompt").onReceive(context);
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