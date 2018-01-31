import { Bot, ConsoleLogger, MemoryStorage, BotStateManager } from 'botbuilder-core';
import { BotFrameworkAdapter } from 'botbuilder-services';
import * as restify from 'restify';
import { LuisRecognizer } from 'botbuilder-ai';
import { ParentTopicState } from 'promptly-bot';
import { RootTopic } from './topics/rootTopic';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD });
server.post('/api/messages', adapter.listen() as any);

// Initialize bot
const bot = new Bot(adapter)
    .use(new ConsoleLogger())
    .use(new MemoryStorage())
    .use(new BotStateManager())
    //.use(new LuisRecognizer("5e013df5-f1df-40a7-9893-437bfdb1811d", "04e545e56dfd417daa44460a04f20ffd"))
    .onReceive((context) => {
        // State isn't fully initialized until the contact/conversation messages are sent, so have to require
        //  activity type is message. Will affect welcome message. Refactor after bug has been addressed.
        if(context.request.type === 'message') {
            const rootTopic = new RootTopic(context);
            return rootTopic.onReceive(context);
        }
    });