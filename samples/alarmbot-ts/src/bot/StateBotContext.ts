import { Activity, BotContext, ConversationState, UserState } from 'botbuilder';

export class StateBotContext<State> extends BotContext {
    // Instead of adding things here, add them in `from()`
    private constructor(context: BotContext) {
        super(context);
    }

    // Define the properties and methods to add to BotContext
    state!: State;
    reply(...activityOrText: (string | Partial<Activity>)[]) {
        return this.sendActivity(... activityOrText);
    }

    // "from" adds any properties or methods that depend on arguments or async calls or both
    // think of it as an async constructor
    static async from <State = any> (
        context: BotContext,
        conversationState: ConversationState<State>,
    ): Promise<StateBotContext<State>> {
        const appContext = new StateBotContext<State>(context);
        appContext.state = await conversationState.read(context);
        return appContext;
    }
}
