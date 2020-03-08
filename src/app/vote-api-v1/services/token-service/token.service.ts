import {
    IProvidedCredentials, IToken, ITokenService,
} from './token.interface';
import { Injectable, Inject } from '@nestjs/common';
import { LOGGER, DI_CONSTANTS } from '../../di-constants';
import { ILogger } from '../../../common/logger';
import { TokenEntity } from '../../entities/typeorm/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IJwtService } from '../jwt/jwt.service.interface';
import { SECONDS_IN_HOUR, MILLISECONDS_IN_SECOND } from '../../../common/constants/constants';
import { InvalidTokenError } from '../../errors/invalid-token.error';

@Injectable()
export class TokenService implements ITokenService {
    private readonly _loggerPrefix: string = `${TokenService.name}`;

    constructor(
        @InjectRepository(TokenEntity)
        protected readonly _tokenRepository: Repository<TokenEntity>,
        @Inject(LOGGER)
        private readonly _logger: ILogger,
        @Inject(DI_CONSTANTS.IJwtService)
        private readonly _jwtService: IJwtService,
    ) {}

    public async addTokenByProvidedCredentials(providedCredentials: IProvidedCredentials): Promise<IToken> {
        this._logger.debug(this._loggerPrefix, 'Try add token by provided credentials');

        try {
            const payload = {
                sub: providedCredentials.accessKey,
                token_type: 'bearer',
            };
            const data = this._jwtService.generateJwt(payload);

            const newToken = {
                accessKey: providedCredentials.accessKey,
                tokenValue: data.jwt,
                tokenType: payload.token_type,
                tokenMeta: {},
                expiresIn: data.expiredIn,
            };

            const createdToken = await this._tokenRepository.save(
                this._tokenRepository.create(newToken),
            );

            return {
                accessToken: createdToken.tokenValue,
            };
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while adding token by provided credentials`,
                providedCredentials,
                err.message,
            );

            throw err;
        }
    }

    public async checkToken(tokenPayload: IToken): Promise<void> {
        this._logger.debug(this._loggerPrefix, 'check token', tokenPayload);
        const verifiedToken = this._jwtService.checkToken(tokenPayload.accessToken);

        try {
            const token = await this._tokenRepository.createQueryBuilder()
                .where('"token_value" = :token', { token: tokenPayload.accessToken })
                .andWhere('"deleted_at" IS NULL')
                .getOne();

            if (
                Number(verifiedToken.exp) !== Number(token.expiresIn) ||
                Number(token.expiresIn) < Math.floor(Date.now() / MILLISECONDS_IN_SECOND)
            ) {
                this._logger.error(
                    this._loggerPrefix,
                    `Token expired`,
                    tokenPayload,
                );

                throw new InvalidTokenError({ message: 'Token expired', verifiedToken });
            }

            return;
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while checking token`,
                tokenPayload,
                err.message,
            );

            throw err;
        }
    }
}