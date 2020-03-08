import * as Transport from 'winston-transport';
import { TransportStreamOptions } from 'winston-transport';
import { Cls } from '../../../cls/cls';
export interface IJsonWithMetaTransportConfig extends TransportStreamOptions {
    lineSeparator?: string;
    printStackTrace?: boolean;
}

export class JsonWithMetaTransport extends Transport {
    private readonly _defaultLineSeparator: string = '';

    constructor(
        private readonly _config: IJsonWithMetaTransportConfig,
        // private readonly _cls: Cls = new Cls(),
    ) {
        super(_config);
    }

    public log(info: any, callback: (...args: any[]) => any): void {
        process.stdout.write(this._stringify(info) + (this._config.lineSeparator || this._defaultLineSeparator));

        callback();
    }

    private _stringify(info: any): string {
        let meta = [
            (info instanceof Error ? info : info.message), ...(info[Symbol.for('splat')] || []),
        ];

        if (this._config.printStackTrace) {
            meta = meta.map(this._processErrorWithStack);
        } else {
            meta = meta.map(this._processError);
        }

        let result;

        try {
            result = JSON.stringify({
                level: info[Symbol.for('level')],
                timestamp: new Date().toISOString(),
                // requestId: this._cls.get(this._cls.defaultKeyName),
                meta,
            });
        } catch (err) {
            result = JSON.stringify({
                level: info[Symbol.for('level')],
                timestamp: new Date().toISOString(),
                // requestId: this._cls.get(this._cls.defaultKeyName),
                meta: '[Circular]',
            });
        }

        return result;
    }

    private _processError(message: any): object {
        if (message === null) {
            message = 'null';
        }

        if (message === undefined) {
            message = 'undefined';
        }

        if (typeof message === 'object') {
            delete message.level; // NOTE dunno why but winston places level attr in message (along with level symbol)
        }
        if (message instanceof Error) {
            const errObj: any = {};

            Object.entries(Object.getOwnPropertyDescriptors(message)).forEach((entry) => {
                errObj[entry[0]] = entry[1].value;
            });

            delete errObj.stack;

            return errObj;
        }

        return message;
    }

    private _processErrorWithStack(message: any): object {
        if (message === null) {
            message = 'null';
        }

        if (message === undefined) {
            message = 'undefined';
        }

        if (typeof message === 'object') {
            delete message.level;
        }

        if (message instanceof Error) {
            const errObj: any = {};

            Object.entries(Object.getOwnPropertyDescriptors(message)).forEach((entry) => {
                errObj[entry[0]] = entry[1].value;
            });

            return errObj;
        }

        return message;
    }
}
