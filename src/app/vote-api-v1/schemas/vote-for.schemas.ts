import { joiExtended } from '../../common/extensions/joi/extended-string.extension';

export const voteForJoiSchema = joiExtended.object({
    voteFor: joiExtended.extendedString().escape().trim().min(1).required(),
    accessKeyId: joiExtended.number().min(0).max(Number.MAX_SAFE_INTEGER).required(),
});