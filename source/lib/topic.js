"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Topic {
    constructor(state) {
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