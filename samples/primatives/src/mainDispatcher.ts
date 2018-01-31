import * as promptsController from './promptsController';

export function dispatchActivity(context: BotContext) {
    if (context.request.type === 'message') {
        if (/add profile/i.test(context.request.text)) {
            Prompt.cancelActivePrompt(context);
            return promptsController.addProfileController(context);
        } else if (/help/i.test(context.request.text)) {
            Prompt.cancelActivePrompt(context);
            return showHelp(context);
        } else if (context.state.conversation && context.state.conversation.activePrompt) {
            return Prompt.routeTo(context);
        } else {
            Prompt.cancelActivePrompt(context);
            return defaultMessage(context);
        }
    }
}

function defaultMessage(context: BotContext) {
    context.reply("'Add Profile'");
}

function showHelp(context: BotContext) {
    let message = "Here's what I can do:\n\n";
    message += "'Add Profile'";

    context.reply(message);
}