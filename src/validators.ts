import { PromptOptions, Validator, ValidatorResult } from 'botbuilder-prompts';
import { Activity, ActivityTypes } from 'botbuilder-core';
import { findAlarmIndex } from './alarms';

export function alarmValidator(context: BotContext): ValidatorResult<string | number> {
    let result = textValidator(context);

    if (result.error) {
        return result;
    }

    let alarmIndex = findAlarmIndex(context.state.user.alarms, context.request.text);
    if (alarmIndex < 0) {
        return { error: 'alarmdoesnotexist' };
    } else {
        //Want to return index here... Should we be able to extend the return value? Should result.value be of type any as opposed to string?
        return {
            value: alarmIndex
        }
    }
}
// TODO: Break this into a file/folder/library of validators.
export function titleValidator(context: BotContext): ValidatorResult<string> {
    let result = textValidator(context);

    if (result.error) {
        return result;
    }

    if (result.value.length > 20) {
        return { error: 'toolong' };
    }

    return { value: result.value };
}

export function textValidator(context: BotContext, options?: TextValidatorOptions): ValidatorResult<string> {
    let result = messageValidator(context);

    if (result.error) {
        // TODO: I have to do this cause the return types are different between messageValidator and textValidator, 
        //  which will be pretty common.
        return { error: result.error };
    }

    if (!context.request.text || context.request.text.length < 1) {
        return { error: 'nottext' };
    }

    options = options || {};
    const value = options.trimReply ? context.request.text.trim() : context.request.text;
    return { value: value };
}

// TODO: I could extend this to have min length, max length, etc. to get rid of titleValidator
//  but wanted to see pattern of multiple layers of validation.
export interface TextValidatorOptions extends PromptOptions {
    trimReply?: boolean;
}

export function messageValidator(context: BotContext): ValidatorResult<Activity> {
    if (context.request.type !== ActivityTypes.message) {
        // TODO: These should be enums on the Validator so it's easy to see what's supported 
        //  and not have to rely on remembering the string value looking at source.
        // TODO: The enums should be composable so I can see that titleValidator can return any of the reasons of it's
        //  predescessors.
        return { error: 'notmessage' };
    }

    return context.request;
}