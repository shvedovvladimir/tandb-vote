import { joiExtended } from '../../common/extensions/joi/extended-string.extension';

export const getResultJoiSchema = joiExtended.object({
    limit: joiExtended.number().min(1).max(100).required(),
    offset: joiExtended.number().min(0).max(Number.MAX_SAFE_INTEGER).required(),
    accessKeyId: joiExtended.number().min(0).max(Number.MAX_SAFE_INTEGER).required(),
});