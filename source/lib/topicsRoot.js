"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parentTopic_1 = require("./parentTopic");
class TopicsRoot extends parentTopic_1.ConversationTopic {
    constructor(context) {
        // Initialize the root topic state and pass that reference to root topic to facilitate the state 
        //  reference chain to context.state.conversation.
        if (!context.state.conversation.topicsRoot) {
            context.state.conversation.topicsRoot = {
                state: { activeTopic: undefined }
            };
        }
        super(context.state.conversation.topicsRoot.state);
    }
}
exports.TopicsRoot = TopicsRoot;
//# sourceMappingURL=topicsRoot.js.map