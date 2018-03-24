import { UserState, ConversationState, BotContext, Promiseable } from 'botbuilder';
export declare abstract class Topic<BUS, BCS, S, V = any> {
    constructor(state: S, userState: UserState<BUS>, conversationState: ConversationState<BCS>);
    private _state;
    state: S;
    abstract onReceive(context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>): Promiseable<any>;
    protected _onSuccess?: (context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>, value: V) => void;
    onSuccess(success: (context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>, value: V) => void): this;
    protected _onFailure?: (context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>, reason: string) => void;
    onFailure(failure: (context: BotContext, userState: UserState<BUS>, conversationState: ConversationState<BCS>, reason: string) => void): this;
}
