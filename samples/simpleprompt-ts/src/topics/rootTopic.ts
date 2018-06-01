import { StateContext } from 'botbuilder-botbldr';
import { TopicsRoot, ConversationTopicState, TextPrompt, IntPrompt } from 'promptly-bot';
import { BotConversationState, BotUserState } from '../app';
import { ActivityTypes } from 'botbuilder';

export interface RootTopicState extends ConversationTopicState { 
    name: string;
    age: number;
}

export class RootTopic 
    extends TopicsRoot<
        StateContext<BotConversationState, BotUserState>, 
        BotConversationState, 
        RootTopicState> {

    public constructor(context: StateContext<BotConversationState, BotUserState>) {
        super(context);

        this.subTopics
            .set("namePrompt", () => new TextPrompt<StateContext<BotConversationState, BotUserState>>()
                .onPrompt(`What is your name?`)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    this.state.name = value;

                    return this.onTurn(context);
                })
            )
            .set("agePrompt", () => new IntPrompt<StateContext<BotConversationState, BotUserState>>()
                .onPrompt(`How old are you?`)
                .onSuccess((context, value) => {
                    this.clearActiveTopic();

                    this.state.age = value;

                    return this.onTurn(context);
                })
            );

    }

    public onTurn(context: StateContext<BotConversationState, BotUserState>) { 

        if (context.activity.type === 'message') {
            
            // Check to see if there is an active topic.
            if (this.hasActiveTopic) {
                // Let the active topic handle this turn by passing context to it's OnReceiveActivity().
                return this.activeTopic!.onTurn(context);
            }

            // If you don't have the state you need, prompt for it
            if (!this.state.name) {
                return this.setActiveTopic("namePrompt")
                    .onTurn(context);
            }

            if (!this.state.age) {
                return this.setActiveTopic("agePrompt")
                    .onTurn(context);                
            }

            // Now that you have the state you need (age and name), use it!
            return context.sendActivity(`Hello ${ this.state.name }! You are ${ this.state.age } years old.`);
        }
    }
}