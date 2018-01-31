import { Attachment, MessageStyler } from 'botbuilder-core';

export interface Profile {
    name: string;
    age: number;
    likesPudding: boolean;
    favoritePudding: string;
    picture: Attachment;
}

export function addProfileController(context: BotContext, profile: Profile = {} as Profile) {

    if (!profile.name) {
        return context.begin(
            namePrompt
                .with({ profile })
        );
    }

    if (!profile.age) {
        return context.begin(
            agePrompt
                .with({ profile })
        );
    }

    if (profile.likesPudding === undefined) {
        return context.begin(
            likesPuddingPrompt
                .with({ profile })
                .reply("Do you like pudding?")
        );
    }

    if (profile.likesPudding) {
        if (!profile.favoritePudding) {
            return context.begin(
                favoritePudding
                    .with({ profile })
                    .reply("What's your favorite flavor of pudding?")
                    .choices(['Chocolate', 'Butterscotch', 'Green'])
            );
        }
    }

    if (!profile.picture) {
        return context.begin(
            picturePrompt
                .with({ profile })
        );
    }

    context.state.user.profile = profile;

    context.reply(`I've added your profile:\n\n`
        + `Name: ${profile.name}\n\n`
        + `Age: ${profile.age}\n\n`
        + `Pudding: ${profile.likesPudding ? "Yes" : "No" }\n\n`
        + `Favorite Pudding: ${profile.favoritePudding}`
    );
    
    context.reply(MessageStyler.carousel([profile.picture], "Here's your profile picture!"));
}

interface AddProfileWith {
    profile: Profile;
}

const namePrompt = new TextPrompt<AddProfileWith>('/promptsController/namePrompt',
    (context, promptState) => {
        promptState.with.profile.name = promptState.value;

        addProfileController(context, promptState.with.profile);
    },
    (context, promptState) => {
        if (promptState.turns > 0) {
            context.reply("I'm sorry, I was expecting text. Let's try that again.");
        }

        context.reply("What's your name?");
    }
);

const agePrompt = new NumberPrompt<AddProfileWith>('/promptsController/agePrompt',
    (context, promptState) => {
        promptState.with.profile.age = promptState.value;

        addProfileController(context, promptState.with.profile);
    },
    (context, promptState) => {
        if (promptState.turns > 0) {
            context.reply("I'm sorry, I was expecting a number. Let's try that again.");
        }

        context.reply("What's your age?");
    }
);

const likesPuddingPrompt = new ConfirmPrompt<AddProfileWith>('/promptsController/likesPuddingPrompt',
    (context, promptState) => {
        promptState.with.profile.likesPudding = promptState.value;

        addProfileController(context, promptState.with.profile);
    }
    // Note: Adding a prompter will overwrite the card, so you need to supply the whole card?
    /*,
    (context, promptState) => {
        if (promptState.turns > 0) {
            context.reply("I'm sorry, I was expecting 'yes' or 'no'. Let's try that again.");
        }

        context.reply("Do you like pudding?");
    }*/
);

const favoritePudding = new ChoicePrompt<AddProfileWith, {} >('/promptsController/favoritePudding',
    (context, promptState) => {
        promptState.with.profile.favoritePudding = promptState.value;

        addProfileController(context, promptState.with.profile);
    }
    // Note: Adding a prompter will overwrite the card, so you need to supply the whole card?
    /*,
    (context, promptState) => {
        if (promptState.turns > 0) {
            context.reply("I'm sorry, I was expecting one of the !!!choices!!!! Let's try that again.");
        }

        context.reply("What's your favorite flavor of pudding?");
    }*/
);

const picturePrompt = new AttachmentPrompt<AddProfileWith>('/promptsController/picturePrompt',
    (context, promptState) => {
        promptState.with.profile.picture = promptState.value[0];

        addProfileController(context, promptState.with.profile);
    },
    (context, promptState) => {
        if (promptState.turns > 0) {
            context.reply("I'm sorry, I was expecting you to send a picture. Let's try that again.");
        }

        context.reply("Do you have a profile picture?");
    }
);
