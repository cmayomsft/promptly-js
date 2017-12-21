import { Alarm, showAlarms } from '../alarms';
import { Topic } from '../promptly/topic';
import { ParentTopic, ParentTopicState } from '../promptly/parentTopic';
import { Prompt } from '../promptly/prompt';
import { Validator } from '../validator/validator';

export interface DeleteAlarmTopicState extends ParentTopicState {
    alarmIndex?: number;
    alarm?: Partial<Alarm>;
    deleteConfirmed?: boolean;
}

export class DeleteAlarmTopicUsingPrompts extends ParentTopic<DeleteAlarmTopicState> {
    
    public onReceive(context: BotContext) {

        const alarms = context.state.user.alarms || [];

        // If there are no alarms to delete...
        if (alarms.length === 0) {
            return context.reply(`There are no alarms to delete.`);
        }

        if (!this.state.alarmIndex) {
            // If there is only one alarm to delete, use that index. No need to prompt.
            if (alarms.length === 1) {
                showAlarms(context);

                this.state.alarmIndex = 0;
            } else {
                const promptState = (!this.state.activeTopic) ? { turns: undefined } : this.state.activeTopic.state;

                this.setActiveTopic(context, 
                    new Prompt<number>(promptState)
                        .onPrompt((c, ltvr) => {                           
                            let msg = `Which alarm would you like to delete?`
        
                            if(ltvr && ltvr === 'indexnotfound') {
                                c.reply(`Sorry, I coulnd't find an alarm named '${context.request.text}'.`)
                                    .reply(`Let's try again.`);
                            }
                            
                            // Basically the prompt is a choice prompt, so show the alarms.
                            showAlarms(context);
    
                            return c.reply(msg);
                        })
                        .validator(new AlarmIndexValidator(alarms))
                        .maxTurns(2)
                        .onSuccess((c, v) => {
                            this.state.alarmIndex = v;
                            
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
        }

        this.state.alarm.title = alarms[this.state.alarmIndex].title;
    
        if (!this.state.deleteConfirmed) {

            const promptState = (!this.state.activeTopic) ? { turns: undefined } : this.state.activeTopic.state;
            
            this.setActiveTopic(context, 
                new Prompt<boolean>(promptState)
                    .onPrompt((c, ltvr) => {
                        let msg = `Are you sure you want to delete alarm '${ this.state.alarm.title }' ('yes' or 'no')?`;

                        if(ltvr && ltvr === 'notyesorno') {
                            c.reply(`Sorry, I was expecting 'yes' or 'no'.`)
                                .reply(`Let's try again.`);
                        }

                        return c.reply(msg);
                    })
                    .validator(new YesOrNoValidator())
                    .maxTurns(2)
                    .onSuccess((c, v) => {
                        this.state.deleteConfirmed = v;
                        
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

        if (this.state.deleteConfirmed) {
            // TODO: Refactor into onSuccess/onFailure of Topic.
            alarms.splice(this.state.alarmIndex, 1);
            return context.reply(`Done. I've deleted alarm '${this.state.alarm.title}'.`);
        } else {
            return context.reply(`Ok, I won't delete alarm ${this.state.alarm.title}.`);
        }
    }
}

class AlarmIndexValidator extends Validator<number> {

    private _alarms: Alarm[] = [];

    constructor(alarms: Alarm[]) {
        super();
        this._alarms = alarms;
    }

    public validate(context: BotContext) {
        const index = this._alarms.findIndex((alarm) => {
            return alarm.title.toLowerCase() === context.request.text.toLowerCase();
        });

        if(index > -1) {
            return { value: index };
        } else {
            return { reason: 'indexnotfound' };
        }
    }
}

// TODO: Refactor into a confirm prompt with yes, y, yup, etc. validator.
class YesOrNoValidator extends Validator<boolean> {
    public validate(context: BotContext) {
        if(context.request.text === 'yes') {
            return { value: true };
        } else if(context.request.text === 'no') {
            return { value: false };
        } else {
            return { reason: 'notyesorno' };
        }
    }
}