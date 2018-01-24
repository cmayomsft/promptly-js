import { Alarm, showAlarms } from '../alarms';
import { Topic } from '../promptly/topic';
import { ParentTopic, ParentTopicState } from '../promptly/parentTopic';
import { Prompt } from '../promptly/prompt';
import { Validator } from '../validator/validator';

export interface DeleteAlarmTopicState extends ParentTopicState {
    alarms?: Alarm[];
    alarmIndex?: number;
    alarm?: Partial<Alarm>;
    deleteConfirmed?: boolean;
}

export interface DeleteAlarmTopicValue {
    alarm: Partial<Alarm>;
    alarmIndex: number;
    deleteConfirmed: boolean;
}

export class DeleteAlarmTopic extends ParentTopic<DeleteAlarmTopicState, DeleteAlarmTopicValue> {

    public constructor(name: string, alarms: Alarm[], state: DeleteAlarmTopicState = { alarms: [] as Alarm[], alarm: {} as Alarm, activeTopic: undefined }) {
        super(name, state);

        if(alarms) {
            this.state.alarms = alarms;
        }

        this.subTopics
            .set("whichAlarmPrompt", () => new Prompt<number>("whichAlarmPrompt")
                .onPrompt((context, lastTurnReason) => {                           
                    let msg = `Which alarm would you like to delete?`
    
                    if(lastTurnReason && lastTurnReason === 'indexnotfound') {
                        context.reply(`Sorry, I coulnd't find an alarm named '${context.request.text}'.`)
                            .reply(`Let's try again.`);
                    }
                    
                    showAlarms(context, this.state.alarms);
    
                    return context.reply(msg);
                })
                .validator(new AlarmIndexValidator(this.state.alarms))
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.state.activeTopic = undefined;

                    this.state.alarmIndex = value;
    
                    return this.onReceive(context);
                })
                .onFailure((context, reason) => {
                    this.state.activeTopic = undefined;

                    if(reason && reason === 'toomanyattempts') {
                        context.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                    }
    
                    return;
                })
            )
            .set("confirmDeletePrompt", () => new Prompt<boolean>("confirmDeletePrompt")
                .onPrompt((context, lastTurnReason) => {
                    let msg = `Are you sure you want to delete alarm '${ this.state.alarm.title }' ('yes' or 'no')?`;
    
                    if(lastTurnReason && lastTurnReason === 'notyesorno') {
                        context.reply(`Sorry, I was expecting 'yes' or 'no'.`)
                            .reply(`Let's try again.`);
                    }
    
                    return context.reply(msg);
                })
                .validator(new YesOrNoValidator())
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.state.activeTopic = undefined;

                    this.state.deleteConfirmed = value;
    
                    return this.onReceive(context);
                })
                .onFailure((c, fr) => {
                    this.state.activeTopic = undefined;
                    
                    if(fr && fr === 'toomanyattempts') {
                        c.reply(`I'm sorry I'm having issues understanding you. Let's try something else. Say 'Help'.`);
                    }
    
                    return;
                })
            );
    }

    public onReceive(context: BotContext) {

        if(this.hasActiveTopic) { 
            return this.activeTopic.onReceive(context);
        }

        // If there are no alarms to delete...
        if (this.state.alarms.length === 0) {
            return context.reply(`There are no alarms to delete.`);
        }

        if (this.state.alarmIndex === undefined) {
            // If there is only one alarm to delete, use that index. No need to prompt.
            if (this.state.alarms.length === 1) {
                showAlarms(context, this.state.alarms);

                this.state.alarmIndex = 0;
            } else {
                this.setActiveTopic("whichAlarmPrompt");
                    
                return this.activeTopic.onReceive(context);
            }
        }

        this.state.alarm.title = this.state.alarms[this.state.alarmIndex].title;
    
        if (this.state.deleteConfirmed === undefined) {
            this.setActiveTopic("confirmDeletePrompt");

            return this.activeTopic.onReceive(context);
        }

        return this._onSuccess(context, { alarm: this.state.alarm, alarmIndex: this.state.alarmIndex, deleteConfirmed: this.state.deleteConfirmed });
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