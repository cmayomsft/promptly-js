"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("./topic");
// ConversationTopic - Used to model a topic of conversation with (optional) sub-topics, such as 
//  child Topics and or Prompts.
class ConversationTopic extends topic_1.Topic {
    constructor() {
        super(...arguments);
        // subTopics - Map of functions used to create any sub-topics for the conversation topic
        //  between turns.
        this._subTopics = new Map();
    }
    get subTopics() {
        return this._subTopics;
    }
    // setActiveTopic - Called to set one of the sub-topics managed by this.subTopics() to be 
    //  the active Topic. 
    //  subTopicKey - The key in the this.subTopics() map used to create the active Topic 
    //      on the initial turn (turn 0) and to recreate the active topic on subsequent turns, 
    //      until the active Topic completes.
    //  args - Any arguments used to create the topic on the initial turn (turn 0).
    setActiveTopic(subTopicKey, ...args) {
        let subtopic = this.subTopics.get(subTopicKey);
        // Check to make sure there is a function to create the Topic in this.subTopics.
        if (subtopic === undefined) {
            throw new Error(`There is no subtopic with the key '${subTopicKey}'. Could '${subTopicKey}' be misspelled?`);
        }
        // Instantiate/set the active Topic by calling the corresponding function from this.subTopics(),
        //  using args if supplied.
        if (args.length > 0) {
            this._activeTopic = subtopic(...args);
            ;
        }
        else {
            this._activeTopic = subtopic();
            ;
        }
        // Persist the this.subTopics() key used to create/set the active Topic and the 
        //  sub-topics's state, "dehydrating" the active topic, so it can be 
        //  "rehydrated" on subsequent turns.
        this.state.activeTopic = { key: subTopicKey, state: this._activeTopic.state };
        return this._activeTopic;
    }
    // activeTopic - Used to recreate ("rehydrate") the active topic on the current turn
    //  so it can handle the context/message of the current turn.
    get activeTopic() {
        // If there is no active topic persisted in state, there is not active topic.
        if (!this.state.activeTopic) {
            return undefined;
        }
        // If there is an active child topic object reference, return that.
        if (this._activeTopic) {
            return this._activeTopic;
        }
        let subtopic = this.subTopics.get(this.state.activeTopic.key);
        // Check to make sure there is a function to create the Topic in this.subTopics.
        if (subtopic === undefined) {
            throw new Error(`Could not find an activeTopic with the key '${this.state.activeTopic.key}'. Could '${this.state.activeTopic.key}' have been removed from subTopics?`);
        }
        // Recreate the active topic using the applicable function in this.subTopics() 
        //  and the state persisted on the last turn.
        this._activeTopic = subtopic();
        this._activeTopic.state = this.state.activeTopic.state;
        return this._activeTopic;
    }
    get hasActiveTopic() {
        return this.state.activeTopic !== undefined;
    }
    clearActiveTopic() {
        this.state.activeTopic = undefined;
    }
}
exports.ConversationTopic = ConversationTopic;
//# sourceMappingURL=conversationTopic.js.map