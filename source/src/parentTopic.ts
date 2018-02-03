import { Topic } from './topic';

// ActiveTopicState - Used to persist information required to recreate the active Topic between turns. 
export interface ActiveTopicState {
    // key - Key of function in ConversationTopic.subTopics() map used to create Topic on each turn.
    key: string;
    // state - State of active Topic used to instantiate the active Topic on each turn. 
    //  Note: State must by any becuase child topic state will vary amoung all the possible 
    //      sub-topics for a given ConversationTopic.
    state?: any;
}

// ConversationTopicState - Used to persist information required to recreate the ConversationTopic 
//  between turns, including any active sub-topic (Topic or Prompt). 
//  Note: Extend ConversationTopicState to store state above and what is required to persist the 
//      active sub-topic between turns.
export interface ConversationTopicState {
    activeTopic?: ActiveTopicState;
}

// ConversationTopic - Used to model a topic of conversation with (optional) sub-topics, such as 
//  Topics and or Prompts.
export abstract class ConversationTopic<S extends ConversationTopicState, V = any> extends Topic<S, V> {

    // subTopics - Map of functions used to create any sub-topics for the conversation topic.
    private _subTopics = new Map<string, (any?) => Topic<any>>();
    protected get subTopics(): Map<string, (any?) => Topic<any>> {
        return this._subTopics;
    }

    // _activeTopic - The "active" Topic for the ConversationTopic. When one of the sub-topics is the 
    //  "active" topic, the ConversationTopic's onReceive() should call/defer to the "active" Topic's 
    //  onReceive() to handle messages from the user until the "active" Topic completes.
    private _activeTopic: Topic<any>;
    
    // setActiveTopic - Called to set one of the sub-topics managed by this.subTopics() to be 
    //  the "active" Topic. 
    //  subTopicKey - The key in the subTopics map used to create the active Topic on the initial
    //      turn (turn 0) and to recreate the active topic on subsequent turns, until the 
    //      active Topic completes.
    //  args - Any arguments used to create the topic on the initial turn (turn 0).
    public setActiveTopic(subTopicKey: string, ...args) {
        // If args were supplied, use them...
        if(args.length > 0) {
            
            this._activeTopic = this.subTopics.get(subTopicKey)(...args);;
        } else {
            this._activeTopic = this.subTopics.get(subTopicKey)();;
        }

        this.state.activeTopic = { key: subTopicKey, state: this._activeTopic.state };

        return this._activeTopic;
    }
    public get activeTopic(): Topic<any> {
        // If there is no active topic state, there is no active child topic being managed.
        if(!this.state.activeTopic) {
            return undefined;
        } 
        
        // If there is an active child topic object reference, return that.
        if(this._activeTopic) {
            return this._activeTopic;
        }

        // TODO: This should be constructing the Topic w/ it's state rather than requiring state property.
        this._activeTopic = this.subTopics.get(this.state.activeTopic.key)(this.state.activeTopic.state);

        return this._activeTopic;
    }

    public get hasActiveTopic(): boolean {
        return this.state.activeTopic !== undefined;
    }

    public clearActiveTopic() {
        this.state.activeTopic = undefined;
    }
}