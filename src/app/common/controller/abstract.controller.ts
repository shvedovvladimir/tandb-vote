import { Request as IRequest } from 'express';
import { IHttpResult } from '../interfaces/http-result.interface';

export abstract class AbstractController {
    protected _prepareSimpleHttpResult<T>(result: any): IHttpResult<T> {
        return {
            result,
        };
    }
}