"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parentTopic_1 = require("./parentTopic");
class TopicRoot extends parentTopic_1.ParentTopic {
    constructor(context) {
        // Initialize the root topic state and pass that reference to root topic to facilitate the state 
        //  reference chain to context.state.conversation.
        if (!context.state.conversation.rootTopic) {
            context.state.conversation.rootTopic = {
                state: { activeTopic: undefined }
            };
        }
        super(context.state.conversation.rootTopic.state);
    }
}
exports.TopicRoot = TopicRoot;
//# sourceMappingURL=topicRoot.js.map