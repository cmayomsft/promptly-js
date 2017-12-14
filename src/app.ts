import { Bot, ConsoleLogger, MemoryStorage, BotStateManager } from 'botbuilder-core';
import { BotFrameworkAdapter } from 'botbuilder-services';
import * as restify from 'restify';
import { RootTopic } from './topics/rootTopic';
import { LuisRecognizer } from 'botbuilder-ai';
import { ParentTopicState } from './promptly/parentTopic';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD });
server.post('/api/messages', adapter.listen() as any);

declare global {
    export interface ConversationState {
        rootTopic?: ParentTopicState;
    }
}

// Initialize bot
const bot = new Bot(adapter)
    .use(new ConsoleLogger())
    .use(new MemoryStorage())
    .use(new BotStateManager())
    //.use(new LuisRecognizer("5e013df5-f1df-40a7-9893-437bfdb1811d", "04e545e56dfd417daa44460a04f20ffd"))
    .onReceive((context) => {
        // If Root State is unDef, init it and set to conv.state.
        // Pass it to Root.
        if (!context.state.conversation.rootTopic) {
            context.state.conversation.rootTopic = { activeTopic: undefined } as ParentTopicState;
        }

        const rootTopic = new RootTopic(context.state.conversation.rootTopic);
        return rootTopic.onReceive(context);
    });

        /*// TODO: Need to pass RootTopic() a reference of where to put it's state.
        //  context.state.conversation.rootTopic holds some that holds the state of the root topic.
        //  Solution: You always pass the state, it's not optional, it's just initialzed/new or used.
        //      Move to state objects vs. interfaces?
        // Pass the root an initialized object that it can put it's state into.
        //  Once that reference is set, the rest fo the bojects fit intot hat.

        // 1. Change all Topics to require state in constructor.
        // 2. Define state object to initialize themselves.
        // 3. Set root state and use to construct root topic.
            // Since root topic has state for all sub topics, chain is preserved.
        // 4. Call onRec().*/