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

export class DeleteAlarmTopic extends ParentTopic<DeleteAlarmTopicState> {
    // TODO: Refactor this out to be state of the DeleteAlarmTopic.
    private alarms: Alarm[] = [];

    public constructor(name: string, state: DeleteAlarmTopicState = { alarm: {} as Alarm, activeTopic: undefined }) {
        super(name, state);
    }

    private whichAlarmPrompt = new Prompt<number>('whichAlarmPrompt')
        .onPrompt((c, ltvr) => {                           
            let msg = `Which alarm would you like to delete?`

            if(ltvr && ltvr === 'indexnotfound') {
                c.reply(`Sorry, I coulnd't find an alarm named '${c.request.text}'.`)
                    .reply(`Let's try again.`);
            }
            
            // Basically the prompt is a choice prompt, so show the alarms.
            showAlarms(c);

            return c.reply(msg);
        })
        .validator(new AlarmIndexValidator(this.alarms))
        .maxTurns(2)
        .onSuccess((c, v) => {
            this.state.alarmIndex = v;
            
            // TODO: Move this to base class to clean up and (maybe) loop again.
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
        }
    );

    private confirmDeletePrompt = new Prompt<boolean>('confirmDeletePrompt')
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
        }
    );

    public onReceive(context: BotContext) {

        this.alarms = context.state.user.alarms || [];

        // If there are no alarms to delete...
        if (this.alarms.length === 0) {
            return context.reply(`There are no alarms to delete.`);
        }

        if (this.state.alarmIndex === undefined) {
            // If there is only one alarm to delete, use that index. No need to prompt.
            if (this.alarms.length === 1) {
                showAlarms(context);

                this.state.alarmIndex = 0;
            } else {
                this.activeTopic = this.whichAlarmPrompt;
                    
                return this.activeTopic.onReceive(context);
            }
        }

        // TODO: Refactor this out to make it on success of the which title prompt.
        this.state.alarm.title = this.alarms[this.state.alarmIndex].title;
    
        if (this.state.deleteConfirmed === undefined) {
            
            this.activeTopic = this.confirmDeletePrompt;

            return this.activeTopic.onReceive(context);
        }

        return this._onSuccess(context, this.state);
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