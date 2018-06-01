import { StateContext } from 'botbuilder-botbldr';
import { ConversationTopic, ConversationTopicState, Prompt, Validator } from 'promptly-bot';
import { Alarm, showAlarms } from '../models/alarms';
import { BotConversationState, BotUserState } from '../app';

export interface DeleteAlarmTopicState extends ConversationTopicState {
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

export class DeleteAlarmTopic extends ConversationTopic<StateContext<BotConversationState, BotUserState>, DeleteAlarmTopicState, DeleteAlarmTopicValue> {

    public constructor(alarms: Alarm[], state: DeleteAlarmTopicState = { alarms: [] as Alarm[], alarm: {} as Alarm, activeTopic: undefined }) {
        super(state);

        if(alarms) {
            this.state.alarms = alarms;
        }

        this.subTopics
            .set("whichAlarmPrompt", () => new Prompt<StateContext<BotConversationState, BotUserState>, number>()
                .onPrompt(async (context, lastTurnReason) => {                           
                    if(lastTurnReason && lastTurnReason === 'indexnotfound') {
                        await context.sendActivity(`Sorry, I coulnd't find an alarm named '${ context.activity.text }'.`,
                            `Let's try again.`);
                    }
                    
                    showAlarms(context, this.state.alarms!);
    
                    return context.sendActivity(`Which alarm would you like to delete?`);
                })
                .validator(new AlarmIndexValidator(this.state.alarms!))
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    this.state.alarmIndex = value;
    
                    return this.onReceiveActivity(context);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();

                    if(reason && reason === 'toomanyattempts') {
                        context.sendActivity(`I'm sorry I'm having issues understanding you.`);
                    }
    
                    return this._onFailure!(context, reason);
                })
            )
            .set("confirmDeletePrompt", () => new Prompt<StateContext<BotConversationState, BotUserState>, boolean>()
                .onPrompt((context, lastTurnReason) => {
                    if(lastTurnReason && lastTurnReason === 'notyesorno') {
                        context.sendActivity(`Sorry, I was expecting 'yes' or 'no'.`,
                            `Let's try again.`);
                    }
    
                    return context.sendActivity(`Are you sure you want to delete alarm '${ this.state.alarm!.title }' ('yes' or 'no')?`);
                })
                .validator(new YesOrNoValidator())
                .maxTurns(2)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    this.state.deleteConfirmed = value;
    
                    return this.onReceiveActivity(context);
                })
                .onFailure((context, reason) => {
                    this.clearActiveTopic();
                    
                    if(reason && reason === 'toomanyattempts') {
                        context.sendActivity(`I'm sorry I'm having issues understanding you.`);
                    }
    
                    return this._onFailure!(context, reason);;
                })
            );
    }

    public onReceiveActivity(context: StateContext<BotConversationState, BotUserState>) {
        
        if(this.hasActiveTopic) { 
            return this.activeTopic!.onReceiveActivity(context);
        }

        // If there are no alarms to delete...
        if (this.state.alarms!.length === 0) {
            return context.sendActivity(`There are no alarms to delete.`);
        }

        if (this.state.alarmIndex === undefined) {
            // If there is only one alarm to delete, use that index. No need to prompt.
            if (this.state.alarms!.length === 1) {
                showAlarms(context, this.state.alarms!);

                this.state.alarmIndex = 0;
            } else {
                return this.setActiveTopic("whichAlarmPrompt")
                    .onReceiveActivity(context);
            }
        }

        this.state.alarm!.title = this.state.alarms![this.state.alarmIndex].title;
    
        if (this.state.deleteConfirmed === undefined) {
            return this.setActiveTopic("confirmDeletePrompt")
                .onReceiveActivity(context);
        }

        return this._onSuccess!(context, { alarm: this.state.alarm!, alarmIndex: this.state.alarmIndex, deleteConfirmed: this.state.deleteConfirmed });
    }
}

class AlarmIndexValidator extends Validator<StateContext<BotConversationState, BotUserState>, number> {

    private _alarms: Alarm[] = [];

    constructor(alarms: Alarm[]) {
        super();
        this._alarms = alarms;
    }

    public validate(context: StateContext<BotConversationState, BotUserState>) {
        const index = this._alarms.findIndex((alarm) => {
            return alarm.title.toLowerCase() === context.activity.text.toLowerCase();
        });

        if(index > -1) {
            return { value: index };
        } else {
            return { reason: 'indexnotfound' };
        }
    }
}

class YesOrNoValidator extends Validator<StateContext<BotConversationState, BotUserState>, boolean> {
    public validate(context: StateContext<BotConversationState, BotUserState>) {
        if(context.activity.text === 'yes') {
            return { value: true };
        } else if(context.activity.text === 'no') {
            return { value: false };
        } else {
            return { reason: 'notyesorno' };
        }
    }
}