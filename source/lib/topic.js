"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Topic - Abstract base class for modeling a topic of conversation.
//  State = Interface for the state of the Topic, used to manage the Topic on each turn, 
//      or call to onReceive().
//  Value = Interface for the resulting value for when the Topic completes successfully.
//      Optional for cases where the Topic doesn't need to return a value. 
class Topic {
    constructor(state) {
        // onSuccess - Function to call when the Topic completes successfully, passing the
        //  resulting value of the Topic.
        this._onSuccess = () => { };
        // onFailure - Function to call when the Topic ends unsuccessfully, passing the reason
        //  why the Topic failed. 
        this._onFailure = () => { };
        this._state = state;
        return this;
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }
    onSuccess(success) {
        this._onSuccess = success;
        return this;
    }
    onFailure(failure) {
        this._onFailure = failure;
        return this;
    }
}
exports.Topic = Topic;
//# sourceMappingURL=topic.js.map