export interface IJwtService {
    generateJwt(payload: object): IJwtWithMeta;
    checkToken(token: string): ITokenPayload;
}

export interface IJwtWithMeta {
    jwt: string;
    expiredIn: number;
}

export interface ITokenPayload {
    sub: string;
    token_type: string;
    exp: number;
    iat: number;
}