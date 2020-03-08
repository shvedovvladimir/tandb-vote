import { CommonError } from '../../common/errors/common';

export class ProxyConnectionError extends CommonError {
    constructor(errorDetails: any) {
        super('Can not reach another service', 'PROXY_CONNECTION_REQUEST_ERROR', errorDetails);
    }
}