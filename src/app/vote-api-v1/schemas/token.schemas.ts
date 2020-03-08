import { joiExtended } from '../../common/extensions/joi/extended-string.extension';

export const tokenJoiSchema = joiExtended.object({
    accessToken: joiExtended.extendedString().escape().trim().min(1).required(),
});