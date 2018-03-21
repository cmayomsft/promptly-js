import * as restify from 'restify';
import { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } from 'botbuilder';
import { RootTopic } from './topics/rootTopic';

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Define conversation state shape
interface BotConversationState {
    count: number;
}

// Define user state shape
interface BotUserState {
    name: string;
}

// Add state middleware
const conversationState = new ConversationState<BotConversationState>(new MemoryStorage());
const userState = new UserState<BotUserState>(new MemoryStorage());

adapter
    .use(conversationState)
    .use(userState);

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, async (context) => {
        // State isn't fully initialized until the contact/conversation messages are sent, so have to require
        //  activity type is message. Will affect welcome message. Refactor after bug has been addressed.
        if(context.request.type === 'message') {
            
            return new RootTopic(context)
                .onReceive(context);
        }
    });
});