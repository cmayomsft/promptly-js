import { Alarm } from '../alarms';
import { Topic } from '../../../../source';

export interface AddAlarmTopicState {
    alarm: Alarm;
}

export class AddAlarmTopic extends Topic<AddAlarmTopicState, Alarm> {

    public constructor(state: AddAlarmTopicState = { alarm: {} as Alarm }) {
        super(state); 
    }

    public onReceive(context: BotContext) {

        // Code that collects a title and time goes here...
        const alarm = { title: "Chris", time: "1 pm" };

        return this._onSuccess(context, alarm);
    }
}