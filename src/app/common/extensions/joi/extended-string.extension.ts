import { ValidationOptions } from '@hapi/joi';
import * as Joi from '@hapi/joi';
import * as validator from 'validator';

export const joiExtended = Joi.extend((joi) => {
    return {
        base: joi.string(),
        messages: {
            'extendedString.escape': '"{{#label}}" bad string',
            'extendedString.unescape': '"{{#label}}" bad string',
            'extendedString.normalizeEmail': '"{{#label}}" bad email',
        },
        rules: {
            escape: {
                convert: true,
                method(): any {
                    return this.$_addRule({ name: 'escape' });
                },
                validate(value: string, helpers: any, args: any, options: ValidationOptions): string {
                    return options.convert ?
                        value.replace(/&/g, '&amp;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#x27;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\//g, '&#x2F;')
                            .replace(/\\/g, '&#x5C;')
                            .replace(/`/g, '&#96;')
                        : value;
                },
            },
            unescape: {
                convert: true,
                method(): any {

                    return this.$_addRule({ name: 'unescape' });
                },
                validate(value: string, helpers: any, args: any, options: ValidationOptions): string {
                    return options.convert ?
                        value.replace(/&amp;/g, '&')
                            .replace(/&quot;/g, '"')
                            .replace(/&#x27;/g, '\'')
                            .replace(/lt;/g, '<')
                            .replace(/&gt;/, '>')
                            .replace(/&#x2F;/g, '/')
                            .replace(/&#x5C;/g, '\\')
                            .replace(/&#96;/g, '`')
                        : value;
                },
            },
            normalizeEmail: {
                convert: true,
                method(): any {

                    return this.$_addRule({ name: 'normalizeEmail' });
                },
                validate(value: string, helpers: any, args: any, options: ValidationOptions): string {
                    const result = options.convert ?
                        (validator.default.normalizeEmail(value) || value)
                    : value;

                    if (!validator.default.isEmail(result)) {
                        return value;
                    }

                    return result;
                },
            },
        },
        type: 'extendedString',
    };
});
