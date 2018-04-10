import { BotFrameworkAdapter, MemoryStorage, ConversationState } from 'botbuilder';
import * as restify from 'restify';

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
interface PromptBotState {
    name: string;
    activePrompt: string;
    age: number;
}

// Add conversation state middleware
const conversationState = new ConversationState<PromptBotState>(new MemoryStorage());
adapter.use(conversationState);

// Listen for incoming requests 
server.post(`/api/messages`, (req, res) => {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, async (context) => {
        if (context.request.type === `message`) {

            const state = conversationState.get(context);

            // On the subsequent turn, update state with reply from user and that prompt has completed.


            // If bot doesn't have state it needs, prompt for it.


            // The bot has the state it needs, use it!
            return context.sendActivity(`Hello ${state.name}! You are ${state.age} years old.`);
        } 
    });
});











            /*
            // On the subsequent turn, update state with reply from user and that prompt has completed.
            if (state.activePrompt) {
                switch (state.activePrompt) {
                    // Set state respective to the prompt that we're in 
                    case `namePrompt`:
                        state.name = context.request.text;
                        break;
                    case `agePrompt`:
                        state.age = parseInt(context.request.text);
                        break;
                }
                // End prompt, since we successfully gathered our state
                state.activePrompt = undefined;
            }

            // If bot doesn't have state it needs, prompt for it.
            if (!state.name) {
                state.activePrompt = `namePrompt`;
                return context.sendActivity(`What is your name?`);
            }

            if (!state.age) {
                state.activePrompt = `agePrompt`;
                return context.sendActivity(`How old are you?`);
            }
            */