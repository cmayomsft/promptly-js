"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = require("./topic");
class ParentTopic extends topic_1.Topic {
    constructor() {
        super(...arguments);
        this._subTopics = new Map();
    }
    get subTopics() {
        return this._subTopics;
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
        this._activeTopic = this.subTopics.get(this.state.activeTopic.name)();
        this._activeTopic.state = this.state.activeTopic.state;
        return this._activeTopic;
    }
    setActiveTopic(subTopicKey, ...args) {
        if (args.length > 0) {
            this._activeTopic = this.subTopics.get(subTopicKey)(...args);
            ;
        }
        else {
            this._activeTopic = this.subTopics.get(subTopicKey)();
            ;
        }
        this.state.activeTopic = { name: subTopicKey, state: this._activeTopic.state };
        return this._activeTopic;
    }
    get hasActiveTopic() {
        return this.state.activeTopic !== undefined;
    }
    clearActiveTopic() {
        this.state.activeTopic = undefined;
    }
}
exports.ParentTopic = ParentTopic;
//# sourceMappingURL=parentTopic.js.map