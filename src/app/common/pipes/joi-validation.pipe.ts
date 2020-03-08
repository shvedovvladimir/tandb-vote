import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

import { ValidationError } from '../errors/validation.error';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(
        private readonly _schema: any,
    ) {}

    public transform(_value: any, metadata: ArgumentMetadata): any {
        const { value, error } = this._schema.validate(_value);

        if (error) {
            throw new ValidationError(this._toSanitazerErrorDetails(error));
        }

        return value;
    }

    private _toSanitazerErrorDetails(
        joiValidationError: any,
    ): Array<{target: object, value: string, property: string, children: any[], constraints: object}> {

        const errorProps = joiValidationError.details as Array<{
            message: string, path: string[], type: string, context: any}>;

        const processedDetails = errorProps.map((prop) => {
            const constraint = prop.type.substring(prop.type.lastIndexOf('.') + 1);

            return {
                target: joiValidationError._object,
                value: prop.context.value || '',
                property: prop.path[0],
                children: [],
                constraints: {
                    [constraint]: prop.message,
                },
            };
        });

        return processedDetails;
    }
}
