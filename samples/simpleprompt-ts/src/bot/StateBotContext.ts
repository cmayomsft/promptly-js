import { Activity, TurnContext, ConversationState, UserState } from 'botbuilder';

export class StateBotContext<BotConversationState, BotUserState> extends TurnContext {
    // Instead of adding things here, add them in `from()`
    private constructor(turnContext: TurnContext) {
        super(turnContext);
    }

    // Define the properties and methods to add to BotContext
    conversationState!: BotConversationState;
    userState!: BotUserState;

    // "from" adds any properties or methods that depend on arguments or async calls or both
    // think of it as an async constructor
    static async from <BotConversationState = any, BotUserState = any> (
        turnContext: TurnContext,
        conversationState: ConversationState<BotConversationState>,
        userState: UserState<BotUserState>,
    ): Promise<StateBotContext<BotConversationState, BotUserState>> {
        const stateContext = new StateBotContext<BotConversationState, BotUserState>(turnContext);

        stateContext.conversationState = await conversationState.read(turnContext);
        stateContext.userState = await userState.read(turnContext);

        return stateContext;
    }
}
