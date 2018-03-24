"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conversationTopic_1 = require("./conversationTopic");
// TopicsRoot - A specialized ConversationTopic used to anchor a Topics based conversation model
//  in state.
class TopicsRoot extends conversationTopic_1.ConversationTopic {
    constructor(context, userState, conversationState) {
        if (!conversationState.get(context).rootTopic) {
            // Initialize root ConversationTopic state and persist it to conversatin state
            //  to establish the root of all state in the model.
            conversationState.get(context).rootTopic = {
                activeTopic: undefined
            };
        }
        // Note: This is a subtle, but powerful, aspect of the library. By rooting the TopicsRoot
        //  state in conversation state this way and using that state by reference to all 
        //  subsequent Topics, each Topic's state is persisted automatically (without having to write
        //  state management code).
        super(conversationState.get(context).rootTopic, userState, conversationState);
    }
}
exports.TopicsRoot = TopicsRoot;
//# sourceMappingURL=topicsRoot.js.map