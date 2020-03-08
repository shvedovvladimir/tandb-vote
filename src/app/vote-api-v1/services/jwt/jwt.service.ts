import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IJwtService, IJwtWithMeta, ITokenPayload } from './jwt.service.interface';
import { IJwtPoolConfiguration } from '../../../../../config/configuration.interface';
import { ConfigService } from '@nestjs/config';
import { InvalidTokenError } from '../../errors/invalid-token.error';
import { SECONDS_IN_HOUR, MILLISECONDS_IN_SECOND } from '../../../common/constants/constants';

@Injectable()
export class JwtService implements IJwtService {
    private readonly _config: IJwtPoolConfiguration;
    private readonly _expiredInSeconds: number;

    constructor(
        private readonly _configService: ConfigService,
    ) {
        this._config = _configService.get('jwt');
        this._expiredInSeconds = this._config.main.expiresIn * SECONDS_IN_HOUR;

    }
    public generateJwt(payload: object): IJwtWithMeta {
        const iat = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
        const expiredIn = iat + this._expiredInSeconds;

        const signPayload = Object.assign(payload, {
            exp: expiredIn,
            iat,
        });

        return {
            jwt: jwt.sign(signPayload, this._config.main.secret),
            expiredIn,
        };
    }

    public checkToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token,  this._config.main.secret) as ITokenPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError ||
                err instanceof jwt.JsonWebTokenError ||
                err instanceof jwt.NotBeforeError) {
                throw new InvalidTokenError({ message: err.message, token });
            }

            throw err;
        }
    }
}