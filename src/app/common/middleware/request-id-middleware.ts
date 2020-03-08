import { v4 as uuidv4 } from 'uuid';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Cls } from '../cls/cls';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    protected readonly _cls: Cls = new Cls();
    private readonly _headerName: string = 'x-request-id';

    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        this._cls.run(() => {
            const reqId = req.headers[this._headerName] || uuidv4();

            this._cls.set(this._cls.defaultKeyName, reqId);
            res.setHeader(this._headerName, reqId);

            next();
        });
    }
}