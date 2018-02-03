"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("./topic");
// ConversationTopic - Used to model a topic of conversation with (optional) sub-topics, such as 
//  Topics and or Prompts.
class ConversationTopic extends topic_1.Topic {
    constructor() {
        super(...arguments);
        // subTopics - Map of functions used to create any sub-topics for the conversation topic.
        this._subTopics = new Map();
    }
    get subTopics() {
        return this._subTopics;
    }
    // setActiveTopic - Called to set one of the sub-topics managed by this.subTopics() to be 
    //  the "active" Topic. 
    //  subTopicKey - The key in the subTopics map used to create the active Topic on the initial
    //      turn (turn 0) and to recreate the active topic on subsequent turns, until the 
    //      active Topic completes.
    //  args - Any arguments used to create the topic on the initial turn (turn 0).
    setActiveTopic(subTopicKey, ...args) {
        // If args were supplied, use them...
        if (args.length > 0) {
            this._activeTopic = this.subTopics.get(subTopicKey)(...args);
            ;
        }
        else {
            this._activeTopic = this.subTopics.get(subTopicKey)();
            ;
        }
        this.state.activeTopic = { key: subTopicKey, state: this._activeTopic.state };
        return this._activeTopic;
    }
    get activeTopic() {
        // If there is no active topic state, there is no active child topic being managed.
        if (!this.state.activeTopic) {
            return undefined;
        }
        // If there is an active child topic object reference, return that.
        if (this._activeTopic) {
            return this._activeTopic;
        }
        // TODO: This should be constructing the Topic w/ it's state rather than requiring state property.
        this._activeTopic = this.subTopics.get(this.state.activeTopic.key)(this.state.activeTopic.state);
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
//# sourceMappingURL=parentTopic.js.map