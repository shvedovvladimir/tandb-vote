import { joiExtended } from '../../common/extensions/joi/extended-string.extension';

export const accessKeyJoiSchema = joiExtended.object({
    accessKey: joiExtended.extendedString().escape().trim().min(1).required(),
});